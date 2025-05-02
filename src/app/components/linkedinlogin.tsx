'use client'

import React, {useState, useEffect} from 'react';
import { useSession, signIn } from 'next-auth/react';

interface LinkedInPosition {
    id?: string;
    title: string;
    company: { name: string };
}

interface LinkedInProfile {
    localizedFirstName: string;
    localizedLastName: string;
    headline?: string;
    positions?: { elements: LinkedInPosition[] };
}

export default function LinkedinLogin() {
    const {data: session, status} = useSession();
    const accessToken = session?.accessToken;

    const [profile, setProfile] = useState<LinkedInProfile | null>(null);

    const handleSignIn = () => {
        // redirect to linkedin's oauth and return with an access token
        signIn('linkedin');
    }

    useEffect(() => {
        if (accessToken) {
            fetch('/api/linkedinlogin', {
                headers: { Authorization: `Bearer ${accessToken}`}
            })
            .then((res) => res.json())
            .then((data: LinkedInProfile) => setProfile(data))
            .catch((err) => console.error('Failed to load LinkedIn profile:', err));
        }
    }, [accessToken]);

    return (
        <div className="linkedin-login">
            {status === 'loading' && <p>Checking authentication…</p>}

            {!session && status !== 'loading' && (
                <button onClick={handleSignIn} className="linkedin-button">
                Sign in with LinkedIn
                </button>
            )}

            {session && !profile && <p>Loading your LinkedIn profile…</p>}

            {profile && (
                <div className="profile-data">
                <h2>{profile.localizedFirstName} {profile.localizedLastName}</h2>
                {profile.headline && <p><em>{profile.headline}</em></p>}
                {profile.positions?.elements?.length > 0 && (
                    <ul>
                    {profile.positions.elements.map((pos) => (
                        <li key={pos.id || pos.title}>
                        <strong>{pos.title}</strong> at {pos.company.name}
                        </li>
                    ))}
                    </ul>
                )}
                </div>
            )}
        </div>
    );
}