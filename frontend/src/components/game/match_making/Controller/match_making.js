const params = new URLSearchParams(window.location.search);
const mode = params.get("mode");
import { fetchMyData } from "/src/_api/user.js";

const myData = await fetchMyData();

export default function () {
  console.log("match making worjk here ", myData.username);

}
