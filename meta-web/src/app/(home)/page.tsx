'use client';
import { Home } from '@/components/screens/home';
import { useUserInfoQuery } from '@/redux/slice/user.slice';

const HomePage = () => {
    // This hook call ensures the user data is fetched and populated into the global state.
    // RTK Query handles caching, so this won't cause re-fetches if the data is already present.
    useUserInfoQuery({});

    return (
        <Home />
    );
};

export default HomePage;
