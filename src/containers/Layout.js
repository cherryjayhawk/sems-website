import Sidebar from './Sidebar'
import Main from './Main';

function Layout({ children }) {
	return ( 
		<div className="flex h-screen ">
			{/* SIDEBAR */}
			<Sidebar />
			{/* MAIN */}
			<Main>
				{ children }
			</Main>
		</div>
	 );
}

export default Layout;