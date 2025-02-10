export const register = async (data) => {
  try {
    const res = await fetch("http://localhost:2302/api/register", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    
    return result;
  } catch (error) {
    console.log(error);
  }
}