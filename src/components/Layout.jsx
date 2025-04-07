import Head from 'next/head';
// tiêu đề (title) của trang
function Layout({ title, children }) {
  return (
    <>
      <Head>
        <title>{`${title ? `${title} — ` : ""}Tickits`}</title>
      </Head>
      {children}
    </>
  );
}

export default Layout;
