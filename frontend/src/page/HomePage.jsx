import React, { useEffect, useState } from 'react';
import { Form, json, useActionData, useSubmit } from 'react-router-dom';
import classes from './HomePage.module.css';

const NAME_PREDICT = { 0: 'Lionel Messi', 1: 'Neyrma', 2: 'Cristiano Ronaldo' };

const convertBase64 = (file) => {
   return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
         resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
         reject(error);
      };
   });
};

function HomePage() {
   const [base64, setbase64] = useState(null);
   const submit = useSubmit();
   const image = useActionData();
   const [predictText, setPredictText] = useState(null);
   const [objAccuracy, setobjAccuracy] = useState({});
   const handleFileRead = async (event) => {
      const file = event.target.files[0];
      const base64 = await convertBase64(file);
      setbase64(base64);
   };

   const handleSubmit = function (event) {
      event.preventDefault();

      if (base64) {
         let formData = new FormData();
         formData.append('base64', base64);
         submit(formData, { action: '/', method: 'post' });
      }
   };
   const encode = base64 ? `data:image/jpeg;base64,${base64?.split(',')[1]}` : '';
   useEffect(() => {
      if (image?.predict) {
         const predict = image.predict[0];
         const accuracy = predict.class_probability;
         const accuracyFilter = accuracy.map(function (value, index) {
            const name = NAME_PREDICT[index];
            return { [name]: value };
         });
         setobjAccuracy(accuracyFilter);
         if (predict.class === 'cristiano_ronaldo') setPredictText('Cristiano Ronaldo');
         else if (predict.class === 'lionel_messi') setPredictText('Lionel Messi');
         else if (predict.class === 'neyrma') setPredictText('Neyrma');
      }
   }, [image]);

   
   return (
      <>
         <h1>Phân loại các vân động viên thể thao</h1>
         <Form method="post" action="/">
            <input
               type="file"
               //   inputProps={{ accept: 'image/*' }}
               onChange={handleFileRead}
               required
               name="image"
            />
            {/* <input type="text" /> */}
            <input type="submit" onClick={handleSubmit} />
         </Form>
         <div className={classes.blox}>
            <div>
               {encode && image?.predict && <img src={encode} className={classes.img} alt="" />}
               {predictText && <p>Predict : {predictText}</p>}
            </div>
            <table>
               <thead className='thead'>
                  <tr>
                     {Object.keys(objAccuracy).length !== 0 && objAccuracy?.map((value,index) => <th key={index} >{Object.keys(value)}</th>) } 
                  </tr>
               </thead>
               <tbody>
                  <tr>
                        {Object.keys(objAccuracy).length !== 0 && objAccuracy?.map((value,index) => <th key={index} >{Object.values(value)} % </th>) } 
                  </tr>
               </tbody>
            </table>
         </div>
      </>
   );
}

export default HomePage;

export async function action({ request }) {
   const data = await request.formData();
   const datAuth = {
      image_data: data.get('base64'),
   };
   if (!datAuth) {
      return json({ isErro: "You don't upload file " }, { status: 401 });
   }
   const url = 'http://127.0.0.1:8000/api/classify_image';
   const response = await fetch(url, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify(datAuth),
   });
   if (!response.ok) return json({ error: 'Failed to fetch image data' }, { status: 401 });

   const resData = await response.json();

   return json({ predict: resData }, { status: 200 });
}
