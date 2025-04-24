import React from 'react'

function Notfound() {
  return (
    <>
      <div className='not-found-container' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <h1>404</h1>
        <h3>This Page Does Not Exist</h3>
        <p>Sorry, the page you are looking for could not be found. It's just an accident that was not intentional.</p>
      </div>
    </>
  )
}

export default Notfound