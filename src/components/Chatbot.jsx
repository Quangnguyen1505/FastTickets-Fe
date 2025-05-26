import { useEffect, useRef, useState } from 'react';
import { MessageSquare, X, Bot, User, Users, Send } from 'lucide-react';
import { sendMessage } from '@/utils/https/chatbot';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

export default function ChatbotUI() {
  const [open, setOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState(null);
  const [messagesMap, setMessagesMap] = useState({
    1: [],
    2: [],
    3: [],
  });
  const [input, setInput] = useState('');

  const userStore = useSelector((state) => state.user.data);
  const token = userStore.tokens?.accessToken;
  const userId = userStore.shop?.id;

  const [sessionId, setSessionId] = useState(null);
  const socketRef = useRef(null);

  const messagesEndRef = useRef(null);

  const inputRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesMap]);

  useEffect(() => {
    if (selectedMode !== null) {
      if (inputRef.current) {
        inputRef.current.focus();
      }

      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [selectedMode]);  

  const websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

  const chatOptions = [
    {
      id: 1,
      title: "Chat với AI",
      icon: <Bot size={18} />,
      description: "Hỗ trợ tự động 24/7"
    },
    {
      id: 2,
      title: "Chat với nhân viên",
      icon: <User size={18} />,
      description: "Hỗ trợ trực tiếp từ nhân viên"
    },
    {
      id: 3,
      title: "Hội nhóm xem phim",
      icon: <Users size={18} />,
      description: "Thảo luận với cộng đồng"
    }
  ];

  useEffect(() => {
    if (selectedMode === 2 && !socketRef.current) {
      const initOrRestoreSession = async () => {
        let storedSessionId = localStorage.getItem("chat_session_id");
        if (!storedSessionId) {
          const res = await fetch('/api/chat/init-session', {
            method: 'POST',
            headers: {
              'x-client-id': userId,
              'authorization': token
            },
            body: JSON.stringify({ userId }),
          });

          const data = await res.json();
          storedSessionId = data.data;
          localStorage.setItem("chat_session_id", storedSessionId);
        }

        setSessionId(storedSessionId);
        console.log('storedSessionId', storedSessionId);

        const historyRes = await fetch(`/api/chat/history/${storedSessionId}`, {
          headers: {
            'x-client-id': userId,
            'authorization': token
          },
        });
        
        const historyData = await historyRes.json();
        console.log('historyData', historyData);     
        setMessagesMap(prev => ({
          ...prev,
          2: (historyData.data || []).map(item => ({
            from: item.sender_id === userId ? 'user' : 'staff',
            text: item.message,
            timestamp: new Date(item.sent_at).getTime(),
          }))
        }));

        const ws = new WebSocket(`${websocketUrl}?sessionId=${storedSessionId}`);
        socketRef.current = ws;

        ws.onopen = () => console.log('🟢 WebSocket connected');
        ws.onmessage = (event) => {
          console.log('event', event);
          const msg = JSON.parse(event.data);
          console.log('msg1', msg);
          if (msg.event === "session_closed") {        
            toast.success("Admin đã đóng cuộc trò chuyện, Cuộc trò chuyện kết thúc!")
            localStorage.removeItem("chat_session_id");
            setSelectedMode(null);
        
            return;
          }

          if (msg.event === "staff_joined") {
            const messagejoin = "Nhân viên đã vào để hổ trợ bạn"
            toast.success(messagejoin);
        
            return;
          }
          if (msg.sender_id === userId) return;
          // setMessages(prev => [
          //   ...prev.filter(m => !m.typing),
          //   { from: 'staff', text: msg.message,  timestamp: new Date(msg.sent_at).getTime()}
          // ]);
          setMessagesMap(prev => ({
            ...prev,
            2: [
              ...prev[2].filter(m => !m.typing),
              { from: 'staff', text: msg.message, timestamp: new Date(msg.sent_at).getTime() }
            ]
          }));
        };
        // ws.onclose = () => {
        //   console.log('🔴 WebSocket disconnected');
        //   socketRef.current = null;
        // };
      };

      initOrRestoreSession();
    }

    return () => {
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [selectedMode, token, userId, websocketUrl]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { from: 'user', text: input.trim(), timestamp: Date.now() };
    setMessagesMap(prev => ({
      ...prev,
      [selectedMode]: [...(prev[selectedMode] || []), userMessage]
    }));
    setInput('');

    if (selectedMode === 1) {
      const typingMessage = { from: 'ai', text: 'typing', typing: true };
      setMessagesMap(prev => ({
        ...prev,
        1: [...prev[1], typingMessage]
      }));
    }

    // const typingMessage = { from: 'ai', text: 'typing', typing: true };
    // setMessagesMap(prev => ({
    //   ...prev,
    //   [selectedMode]: [...(prev[selectedMode] || []), typingMessage]
    // }));

    try {
      if (selectedMode === 1) {
        const res = await sendMessage(input.trim());
        const aiReply = res.data?.response || 'Xin lỗi, tôi không hiểu câu hỏi của bạn.';
        setMessagesMap(prev => ({
          ...prev,
          1: [
            ...prev[1].filter(msg => !msg.typing),
            { from: 'ai', text: aiReply }
          ]
        }));        
      } else if (selectedMode === 2 && socketRef.current) {
        console.log("sender ", userId)
        const payload = {
          sender: userId,
          message: input.trim(),
          sessionId,
        };

        await fetch('/api/chat/send-message', {
          method: 'POST',
          headers: {
            'x-client-id': userId,
            'authorization': token
          },
          body: JSON.stringify(payload),
        });
      }
    } catch (error) {
      console.error('Lỗi gọi API:', error);
      setMessagesMap(prev => ({
        ...prev,
        [selectedMode]: [
          ...prev[selectedMode].filter(msg => !msg.typing),
          { from: 'ai', text: 'Đã xảy ra lỗi khi gửi tin nhắn. Vui lòng thử lại.' }
        ]
      }));
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => {
          setOpen(!open);
          setSelectedMode(null);
        }}
        className={`bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-xl transition-all duration-300 ${
          open ? 'rotate-45 scale-0' : 'rotate-0 scale-100'
        }`}
      >
        {open ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {open && (
        <div className="w-[350px] h-[500px] bg-white rounded-xl shadow-2xl absolute bottom-20 right-0 overflow-hidden border border-gray-200 animate-scale-in flex flex-col">
          <div className="bg-orange-500 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {selectedMode !== null && (
                <button
                  onClick={() => setSelectedMode(null)}
                  className="mr-2 hover:bg-orange-600 p-1 rounded-full transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              {selectedMode === 1 && <Bot size={20} />}
              {selectedMode === 2 && <User size={20} />}
              {selectedMode === 3 && <Users size={20} />}
              <h3 className="font-semibold">
                {selectedMode === 1 && 'Trợ lý ảo AI'}
                {selectedMode === 2 && 'Chat với nhân viên'}
                {selectedMode === 3 && 'Hội nhóm xem phim'}
                {selectedMode === null && 'Chọn chế độ trò chuyện'}
              </h3>
            </div>
            <button 
              onClick={() => setOpen(false)}
              className="hover:bg-orange-600 rounded-full p-1 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {selectedMode === null ? (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <p className="text-gray-600">Chọn chế độ trò chuyện</p>
                </div>
                {chatOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedMode(option.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      selectedMode === option.id 
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'bg-white hover:bg-gray-100 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        selectedMode === option.id 
                          ? 'bg-orange-600' 
                          : 'bg-orange-100'
                      }`}>
                        {option.icon}
                      </div>
                      <div>
                        <h4 className="font-medium">{option.title}</h4>
                        <p className={`text-sm ${
                          selectedMode === option.id 
                            ? 'text-orange-100' 
                            : 'text-gray-500'
                        }`}>
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {(messagesMap[selectedMode] || []).map((msg, idx) => (
                  <div
                    key={`msg-${idx}-${msg.timestamp || Date.now()}`}
                    className={`p-2 rounded-md max-w-[80%] ${
                      msg.from === 'user'
                        ? 'bg-orange-100 self-end text-right'
                        : 'bg-gray-200 self-start text-left'
                    }`}
                  >
                    {msg.typing ? (
                      <TypingIndicator />
                    ) : (
                      <>
                        <div>{msg.text}</div>
                        {msg.timestamp && (
                          <div className="text-xs text-gray-400 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>


          {(selectedMode === 1 || selectedMode === 2) && (
            <div className="p-3 border-t bg-white flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Nhập tin nhắn..."
              />
              <button
                onClick={handleSend}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg p-2"
              >
                <Send size={16} />
              </button>
            </div>
          )}

          {selectedMode === null && (
            <div className="border-t border-gray-200 p-4 bg-white text-center">
              <p className="text-xs text-gray-500">
                Lựa chọn của bạn sẽ được kết nối ngay lập tức
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2 bg-gray-200 rounded-md w-fit">
      <div className="flex space-x-1 ml-2">
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0s]" />
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]" />
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]" />
      </div>
    </div>
  );
}