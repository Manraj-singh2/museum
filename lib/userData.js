const { getToken } = require("./authenticate");


export async function addToFavourites(id) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/favourites/id`,
      {
        method: "PUT",
        headers: {
          Authorization: `JWT ${getToken()}`,
        },
      }
    );

    if (res.status === 200) {
      return await res.json();
    } else {
      return [];
    }
  } catch (err) {
    console.error("Failed to add to favourites:", err);
    return [];
  }
}

export async function removeFromFavourites(id) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/favourites/id`,
      {
        method: "DELETE",
        headers: {
          Authorization: `JWT ${getToken()}`,
        },
      }
    );

    if (res.status === 200) {
      return await res.json();
    } else {
      return [];
    }
  } catch (err) {
    console.log("Failed to remove favourites:", err);
  }
}

export async function getFavourites() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favourites`, {
      method: "GET",
      headers: {
        Authorization: `JWT ${getToken()}`,
      },
    });

    if (res.status === 200) {
      return await res.json();
    } else {
      return [];
    }
  } catch (err) {
    console.log("Failed to remove favourites:", err);
  }
}


export async function addToHistory(id) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/history/id`,
      {
        method: "PUT",
        headers: {
          Authorization: `JWT ${getToken()}`,
        },
      }
    );

    if (res.status === 200) {
      return await res.json();
    } else {
      return [];
    }
  } catch (err) {
    console.error("Failed to add history:", err);
    return [];
  }
}

export async function removeFromHistory(id) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/history/id`,
      {
        method: "DELETE",
        headers: {
          Authorization: `JWT ${getToken()}`,
        },
      }
    );

    if (res.status === 200) {
      return await res.json();
    } else {
      return [];
    }
  } catch (err) {
    console.log("Failed to remove history:", err);
  }
}

export async function getHistory() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/history`, {
      method: "GET",
      headers: {
        Authorization: `JWT ${getToken()}`,
      },
    });

    if (res.status === 200) {
      return await res.json();
    } else {
      return [];
    }
  } catch (err) {
    console.log("Failed to get history:", err);
  }
}