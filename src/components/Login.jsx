import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';
import { client } from '../client';

const Login = () => {

    const navigate = useNavigate();

    const responseGoogle = (response) => {
        const { credential } = response;

        // Decode the ID token
        const decodedToken = jwtDecode(credential);

        // Create user profileObj
        const user = {
            name: decodedToken.name,
            googleID: decodedToken.sub,  // Google Id
            imageUrl: decodedToken.picture
        };
        // store user info
        localStorage.setItem('user', JSON.stringify(user));
        // console.log('user info:', user);

        // sanity document for user profile
        const doc = {
            _id: user.googleID,
            _type: 'user',
            username: user.name,
            image: user.imageUrl
        }

        // create doc in Sanity
        client.createIfNotExists(doc)
            .then(() => {
                navigate('/', { replace: true })
            })

    };

    const handleError = (error) => {
        console.error('Login Error:', error);
        // Handle login error here
    };



    return (
        <section className='flex justify-start items-center flex-col h-screen'>
            <div className='relative w-full h-full '>
                <video
                    src={shareVideo}
                    type='video/mp4'
                    loop={true}
                    controls={false}
                    muted
                    autoPlay
                    className='w-full h-full object-cover'
                />

                <div className='absolute flex flex-col justify-center items-center top-0  right-0 left-0 bottom-0 bg-blackOverlay'>
                    <div className="p-5">
                        <img src={logo} width="130px" alt="logo" />
                    </div>

                    <div className="shadow-2xl  mt-1 ">
                        <GoogleLogin
                            onSuccess={responseGoogle}
                            onError={() => {
                                console.log('Login Failed');
                            }}
                            size="large" // Customize button size
                            text="signin_with" // Customize button text
                            shape="pill" // Customize button shape                                                    

                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Login;