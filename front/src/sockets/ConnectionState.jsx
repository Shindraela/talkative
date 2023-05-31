export const ConnectionState = ({ isConnected }) => {
  return <div className={isConnected ? 'dot dot-green' : 'dot dot-red'}></div>
}
