export const handleDataChange = (name, value, setUserData, setUserDataError) => {
    const formattedValue = name === 'inst_email' ? String(value).toLowerCase() : String(value).toUpperCase();
    setUserData(prev => ({ ...prev, [name]: formattedValue }));
    setUserDataError(prev => ({ ...prev, [name]: '' }));
}