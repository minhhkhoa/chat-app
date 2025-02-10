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

export const checkEmail = async (data) => {
  try {
    const res = await fetch("http://localhost:2302/api/email", {
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

export const checkPassword = async (data) => {
  try {
    const res = await fetch("http://localhost:2302/api/password", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include', //thêm dòng này để nó ghi được token vào cookies
    });

    const result = await res.json();

    return result;
  } catch (error) {
    console.log(error);
  }
}

export const userDetail = async () => {
  try {
    const res = await fetch("http://localhost:2302/api/user-details", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', //- gửi thêm cả cookies lên server
    });

    const result = await res.json();

    return result;
  } catch (error) {
    console.log(error);
  }
}