import React from 'react';
// ✅ NEW IMPORTS: React Icons se asli icons import kiye
import { FaLinkedin, FaInstagram, FaGithub } from 'react-icons/fa'; 

const Footer = () => {
    
    const developerInfo = {
        name: "Aditya Kumar & Team",
        college: "Dronacharya Group Of Institutions",
        linkedin: "https://www.linkedin.com/in/YOUR_LINKEDIN_PROFILE", 
        instagram: "https://www.instagram.com/YOUR_INSTAGRAM_HANDLE",
        github: "https://github.com/YOUR_GITHUB_PROFILE",
    };
    
    const SocialIcon = ({ href, children, title }) => (
        <a 
            href={href} 
            target="_blank"
            rel="noopener noreferrer" 
            // text-white aur hover effect: yeh ab icons ka color control karenge
            className="text-white hover:text-secondary-blue transition duration-150 transform hover:scale-110"
            title={title}
        >
            {children} {/* Ab yahan direct React Icon Component aayega */}
        </a>
    );

    return (
        <footer className="bg-card-bg mt-12 border-t border-secondary-blue/30 shadow-inner">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                
                {/* ... (Top Sections remain the same) ... */}

                {/* ⬇️ Bottom Section: Developer Credit and Social Icons */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-4">
                    
                    {/* Developer Info (Credit) */}
                    <p className="text-sm text-gray-500 mb-3 md:mb-0">
                        Developed by: <span className="text-white font-medium">{developerInfo.name}</span>
                        <span className="block text-xs text-gray-600">{developerInfo.college}</span>
                    </p>

                    {/* Social Icons (Clickable) */}
                    <div className="flex space-x-4">
                        
                        {/* LinkedIn Icon */}
                        <SocialIcon href={developerInfo.linkedin} title="Connect on LinkedIn">
                            <FaLinkedin size={24} /> {/* ✅ React Icon used */}
                        </SocialIcon>
                        
                        {/* Instagram Icon */}
                        <SocialIcon href={developerInfo.instagram} title="Follow on Instagram">
                            <FaInstagram size={24} /> {/* ✅ React Icon used */}
                        </SocialIcon>
                        
                         {/* GitHub Icon */}
                         <SocialIcon href={developerInfo.github} title="View Project on GitHub">
                            <FaGithub size={24} /> {/* ✅ React Icon used */}
                        </SocialIcon>

                    </div>
                </div>
                 
                {/* Copyright Line */}
                <div className="mt-6 pt-4 border-t border-gray-700/70 text-center">
                    <p className="text-xs text-gray-500">
                        &copy; {new Date().getFullYear()} EquiScan Project. All rights reserved.
                    </p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;