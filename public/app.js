/**
 * Return a unique 8-digit ID for the client.  This is stored in
 * window.localStorage, so the same ID will be used if someone accesses the
 * site again later.
 */
function uid() {
  if (typeof(window.localStorage["uid"]) == "undefined") {
    window.localStorage["uid"] = Math.floor(Math.random() * 100000000);
  }

  return window.localStorage["uid"];
}

console.log(uid());
