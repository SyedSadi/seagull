import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const Profile = () => {
    const { user } = useContext(AuthContext)
    console.log(user)
  return (
    <div className='text-center bg-blue-200 px-8'>
        <h1 className="text-3xl p-4 mb-4">My Profile</h1>
        <h1 className="text-2xl m-2">{user.username}</h1>
        <h2 className="text-xl m-2">{user.role}</h2>
        <p>{user.bio}</p>
        <h3 className="text-lg m-2">{user.email}</h3>

    </div>
  )
}

export default Profile