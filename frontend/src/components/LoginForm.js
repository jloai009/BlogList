import React from "react"

const LoginForm = ( props ) => (
  <div>
    <h2>Log in to Blog-List</h2>
    <form onSubmit={props.handleLogin}>
      <div>
        <label>Username: </label>
        <input
          type="text"
          value={props.username}
          name="Username"
          onChange={({ target }) => {
            props.setUsername(target.value)
          }}
        />
      </div>
      <div>
        <label>Password: </label>
        <input
          type="password"
          value={props.password}
          name="Password"
          onChange={({ target }) => {
            props.setPassword(target.value)
          }}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
)

export default LoginForm