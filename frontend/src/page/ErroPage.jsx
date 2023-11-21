import React from "react";
import { useRouteError } from "react-router-dom";


// erro compontent
function ErroPage() {
   const error = useRouteError();
   console.log(error);
   let title = "An error occurred!";
   let message = "Something went wrong!";
   if (error.status === 500) {
      message = error.message;
   }
   if (error.status === 404) {
      title = "Not found!";
      message = "Could not find resource or page.";
   }
   return (
      <>
         <h1>{title}</h1>
         <p>{message}</p>
      </>
   );
}

export default ErroPage;
