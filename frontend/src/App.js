import React, { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import Header from './components/Header'
import Content from './components/Content'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [errorOcurred, setErrorOcurred] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    try {
      const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        setUser(user)
        blogService.setToken(user.token)
      }
    } catch (error) {
      window.localStorage.clear()
      window.location.reload()
    }

  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification('Welcome Back ' + user.username)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (exception) {
      setNotification('Wrong username or password')
      setErrorOcurred(true)
      setTimeout(() => {
        setNotification(null)
        setErrorOcurred(false)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
  }

  
  const headerProps = { notification, errorOcurred, user, handleLogout }
  const contentProps = { blogs, setBlogs, setNotification, setErrorOcurred }
  const loginFormProps = {
    notification, errorOcurred,
    username, setUsername,
    password, setPassword,
    handleLogin
  }

  return (
    <div>
      {user ?
        <div>
          <Header {...headerProps}/>
          <Content {...contentProps} />
        </div> :
        <LoginForm {...loginFormProps} />
      }
    </div>
  )
}

export default App