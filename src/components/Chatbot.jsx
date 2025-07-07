import { useEffect, useRef, useState } from 'react';
import { MessageSquare, X, Bot, User, Users, Send, AlertTriangle } from 'lucide-react';
import { sendMessage } from '@/utils/https/chatbot';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import Image from 'next/image';

const CHAT_AI_HISTORY_KEY = 'chatbot_history';

export default function ChatbotUI() {
  const [open, setOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState(null);
  const [messagesMap, setMessagesMap] = useState({
    1: [],
    2: [],
    3: [],
  });
  const [input, setInput] = useState('');
  const [showAIModal, setShowAIModal] = useState(false);

  const userStore = useSelector((state) => state.user.data);
  console.log('userStore', userStore);
  const token = userStore.tokens?.accessToken;
  const userId = userStore.shop?.id;

  const [sessionId, setSessionId] = useState(null);
  const socketRef = useRef(null);

  const messagesEndRef = useRef(null);

  const router = useRouter();

  const inputRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesMap]);

  useEffect(() => {
    if (selectedMode !== null) {
      if(!token || !userId) {
        toast.error("Bạn cần đăng nhập để sử dụng tính năng chat");
        router.push('/login');
        return;
      }
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
        if (!storedSessionId || storedSessionId === "undefined") {
          const res = await fetch('/api/chat/init-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-client-id': userId,
              'authorization': token
            },
            body: JSON.stringify({ 
              name: userStore.first_name === "" ? "Khách hàng" : userStore.first_name, 
              avatar_url: userStore.image || ""
            }),
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
              { from: 'staff', text: msg.message, timestamp: new Date(msg.sent_at).getTime(), isHtml: false }
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

    if (selectedMode === 3 && !socketRef.current) {
      const initGroupOrRestoreSession = async () => {
        let storedGroupSessionId = localStorage.getItem("chat_group_session_id");
        if (!storedGroupSessionId || storedGroupSessionId === "undefined") {
          const res = await fetch('/api/chat/init-session-group', {
            method: 'POST',
            headers: {
              'x-client-id': userId,
              'authorization': token
            },
          });

          const data = await res.json();
          storedGroupSessionId = data.data;
          localStorage.setItem("chat_group_session_id", storedGroupSessionId);

          // Join vào session group
          await fetch('/api/chat/join-session', {
            method: 'POST',
            headers: {
              'x-client-id': userId,
              'authorization': token
            },
            body: JSON.stringify({
              sessionId: storedGroupSessionId,
              staffId: userId
            })
          });
        }

        setSessionId(storedGroupSessionId);

        // Lấy lịch sử tin nhắn
        const historyRes = await fetch(`/api/chat/history/${storedGroupSessionId}`, {
          headers: {
            'x-client-id': userId,
            'authorization': token
          },
        });

        const historyData = await historyRes.json();
        setMessagesMap(prev => ({
          ...prev,
          3: (historyData.data || []).map(item => ({
            from: item.sender_id === userId ? 'user' : 'other',
            text: item.message,
            timestamp: new Date(item.sent_at).getTime(),
            name: item.name || "Thành viên",
            avatar_url: item.avatar_url || "",
          }))
        }));

        const ws = new WebSocket(`${websocketUrl}?sessionId=${storedGroupSessionId}&userId=${userId}`);
        socketRef.current = ws;

        ws.onopen = () => console.log('🟢 Group WS connected');
        ws.onmessage = (event) => {
          console.log('Group WS event', event);
          const msg = JSON.parse(event.data);
          if (msg.sender_id === userId) return;

          setMessagesMap(prev => ({
            ...prev,
            3: [
              ...prev[3].filter(m => !m.typing),
              { 
                from: 'other', 
                text: msg.message, 
                timestamp: new Date(msg.sent_at).getTime(),
                name: msg.name || "Thành viên",
                avatar_url: msg.avatar_url || "",
                isHtml: false 
              }
            ]
          }));
        };
      };

      initGroupOrRestoreSession();
    }


    return () => {
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [selectedMode, token, userId, websocketUrl]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { 
      from: 'user', 
      text: input.trim(), 
      timestamp: Date.now(),
      isHtml: false
    };
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
        const res = await sendMessage(input.trim(), userId);
        console.log('res', res);
        const rawResponse = res.data?.response;
        let aiReply = '';
        let isHtml = false;
        if (typeof rawResponse === 'object' && rawResponse !== null && rawResponse.html) {
          aiReply = rawResponse.html;
          isHtml = true;
        } else if (typeof rawResponse === 'string') {
          aiReply = rawResponse;
        }
        setMessagesMap(prev => ({
          ...prev,
          1: [
            ...prev[1].filter(msg => !msg.typing),
            { from: 'ai', text: aiReply, timestamp: Date.now(), isHtml }
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
      } else if (selectedMode === 3 && socketRef.current) {
          const payload = {
            sender: userId,
            avatar_url: userStore.image || "",
            name: userStore.first_name || "Khách hàng",
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

  //localstorage
  useEffect(() => {
    const savedHistory = localStorage.getItem(CHAT_AI_HISTORY_KEY);
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setMessagesMap(prev => ({
          ...prev,
          1: parsedHistory
        }));
      } catch (error) {
        console.error('Error parsing AI chat history:', error);
        localStorage.removeItem(CHAT_AI_HISTORY_KEY);
      }
    }
  }, []);

  useEffect(() => {
    // Chỉ lưu khi có tin nhắn và không phải tin nhắn "typing"
    const aiMessages = messagesMap[1].filter(msg => !msg.typing);
    
    if (aiMessages.length > 0) {
      localStorage.setItem(CHAT_AI_HISTORY_KEY, JSON.stringify(aiMessages));
    }
  }, [messagesMap[1]]); // Chỉ chạy khi messagesMap[1] thay đổi

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => {
          setOpen(!open);
          setSelectedMode(null);
        }}
        className={`relative bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-xl transition-all duration-300 ${
          open ? 'rotate-45 scale-0' : 'rotate-0 scale-100'
        }`}
      >
        {/* Vòng tròn bao quanh */}
        {!open && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="h-full w-full rounded-full bg-orange-400 opacity-75 animate-ping"></span>
          </span>
        )}
        {/* Icon chính */}
        <MessageSquare size={24} className="relative z-10" />
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
                    onClick={() => {
                      if (option.id === 1) {
                        setShowAIModal(true); // hiện modal cảnh báo
                      } else {
                        setSelectedMode(option.id);
                      }
                    }}
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
                {(messagesMap[selectedMode] || []).map((msg, idx) => {
                  // Nếu là group chat (mode 3) và tin nhắn không phải của mình
                  if (selectedMode === 3 && msg.from === 'other') {
                    return (
                      <div
                        key={`msg-${idx}-${msg.timestamp || Date.now()}`}
                        className="flex items-start gap-2 max-w-[85%] self-start"
                      >
                        <Image
                          src={msg.avatar_url || '/images/profile.png'}
                          alt={msg.name || 'Avatar'}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="bg-gray-200 p-2 rounded-md flex-1">
                          <div className="text-sm font-semibold text-gray-800">
                            {msg.name || 'Thành viên'}
                          </div>
                          <div className="text-sm">
                            {msg.isHtml ? (
                              <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                            ) : (
                              <div>{msg.text}</div>
                            )}
                          </div>
                          {msg.timestamp && (
                            <div className="text-xs text-gray-400 mt-1">
                              {new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }

                  // Các tin nhắn khác
                  return (
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
                      ) : msg.isHtml ? (
                        <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                      ) : (
                        <div>{msg.text}</div>
                      )}
                      {msg.timestamp && (
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>


          {(selectedMode === 1 || selectedMode === 2 || selectedMode === 3) && (
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

      {showAIModal && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 shadow-xl w-[90%] max-w-md">
            <div className="flex items-center mb-3">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <h2 className="text-lg font-semibold text-orange-600">
                Lưu ý khi sử dụng Chatbot AI
              </h2>
            </div>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Trợ lý ảo AI là công cụ hỗ trợ tự động, có thể không hoàn toàn chính xác hoặc phù hợp trong mọi tình huống.
              <br /><br />
              <strong className="text-gray-800">Hướng dẫn sử dụng:</strong><br />
              1. <strong>Hỏi tư vấn:</strong> Hỏi các câu như “Phim hành động nào đang chiếu hôm nay?”, hoặc “Hãy mô tả phim XYZ?”.<br />
              2. <strong>Đặt hàng qua chatbot:</strong><br />
              - Vui lòng hỏi tư vấn về các bộ phim, lịch chiếu, ghế ngồi trước khi sử dụng chức năng đặt hàng.<br />
              - Khi đặt hàng, bạn cần cung cấp thông tin rõ ràng về số lượng và loại sản phẩm bạn muốn mua.<br />
              <span className="italic text-gray-700">
                Ví dụ: &quot;Tôi muốn đặt 1 vé xem phim Thành Phố Không Màu chiếu 20:00 ngày 15/11 ở ghế A12 và ghế thường&quot;.
              </span>
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAIModal(false)}
                className="text-sm px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  setSelectedMode(1);
                  setShowAIModal(false);
                }}
                className="text-sm px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Tiếp tục
              </button>
            </div>
          </div>
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