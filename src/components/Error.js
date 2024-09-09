import { Courier_Prime } from 'next/font/google'

const errFont = Courier_Prime({
	subsets: ['latin-ext'],
	weight: ['400']
})

function Error({ text = 'Error | Terjadi Kesalahan' }) {
	return ( 
		<p className={errFont.className}>{ text }</p>
	 );
}

export default Error;