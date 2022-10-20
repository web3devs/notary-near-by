import NavBar from '../components/NavBar'

export default ({ children }) => {
  return (
    <div className="gird grid-nogutter h-full p-4">
      <NavBar className="col-12" />
      <div className="col-12">{children}</div>
    </div>
  )
}
