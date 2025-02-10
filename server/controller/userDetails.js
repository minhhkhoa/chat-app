const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");

async function userDetails(request, response) {
  try {
    //- client sẽ gửi cookies lên theo nên ta sẽ lấy được thông qua request
    const token = request.cookies.token || "";

    const user = await getUserDetailsFromToken(token);

    return response.status(200).json({
      message: "user details",
      data: user
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true
    })
  }
}

module.exports = userDetails;