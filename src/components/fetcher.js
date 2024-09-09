export const fetcher = async (url, token) => {
    // if (token) {
      const res = await fetch(url, {"headers":{ "Authorization": `bearer ${token}` }})
      const data = await res.json()
      return data
    // }
  }