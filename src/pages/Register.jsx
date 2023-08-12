import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

const Register = ()=> {
    const {isLoggedIn, register} = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    useEffect(()=> {
        if(isLoggedIn) {
            return navigate('/')
        }
    }, [])
    
    const handleEmailChange = e => {
        setEmail(e.target.value)
    }

    const handlePasswordChange = e => {
        setPassword(e.target.value)
    }

    const handlePasswordConfirmChange = e => {
        setConfirmPassword(e.target.value)
    }

    const handleSubmit = (e)=> {
        e.preventDefault()
        if(password !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Password did not match',
            })
        } else {
            const userData = { email, password, cart: [] }
            register(userData)
            if(register) {
                navigate('/login')
            }
        }
    }

    return(
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <div className="container">
                    <h1>Register</h1>
                    <div className="did-floating-label-content">
                        <input 
                        className="did-floating-input" 
                        type="email" 
                        placeholder=" "
                        onChange={handleEmailChange} 
                        value={email}
                        />
                        <label className="did-floating-label">Email</label>
                    </div>
                    <div className="did-floating-label-content">
                        <input 
                        className="did-floating-input" 
                        type="password" 
                        placeholder=" "
                        onChange={handlePasswordChange}
                        value={password}
                        />
                        <label className="did-floating-label">Password</label>
                    </div>
                    <div className="did-floating-label-content">
                        <input 
                        className="did-floating-input" 
                        type="password" 
                        placeholder=" "
                        onChange={handlePasswordConfirmChange}
                        value={confirmPassword}
                        />
                        <label className="did-floating-label">Confirm Password</label>
                    </div>

                    <button className="form-button">Register</button>
                    <Link to='/login' className="form-link">already have account? login here</Link>
                </div>
            </form>
        </div>
    )
}

export default Register 