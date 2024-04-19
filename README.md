# Property Finder

## Property Finder Backend

The Property Finder backend project offers a comprehensive solution for managing property listings and user interactions, utilizing a structured database architecture and robust REST APIs. Through intuitive endpoints, users can seamlessly register, log in, and update their profiles, while also liking properties for personalized recommendations. The system efficiently organizes user and property data, including images, descriptions, and pricing details, ensuring a smooth user experience and facilitating dynamic property management.

A key highlight of the project is its efficient handling of bandwidth and scalability. By implementing optimal queries and text indexing for searching text, the system minimizes data retrieval times and bandwidth usage, even during peak usage periods. The REST API design further enhances data integrity and security through validation of user input and requests, while also providing flexibility for dynamic property updates. This approach ensures that the system remains responsive and adaptable to changing market demands.

Moreover, the seamless integration with Cloudinary elevates the project's image management capabilities. Cloudinary's cloud-based solution optimizes image uploads, storage, and delivery, enhancing loading times and quality across different devices. With features like dynamic resizing and responsive delivery, images are tailored for various screen sizes, reducing bandwidth usage and improving overall performance. By leveraging Cloudinary's robust infrastructure, the Property Finder backend project sets a new standard for efficiency and reliability in real estate management platforms, prioritizing user satisfaction and scalability.

```
Here is a dummy login user login information

email: hrk@gmail.com
password: hrk123
```

### BackEnd Setup

- Clone the backend repo

      https://github.com/pythonpioneer/property-finder-backend.git

- Go to your project folder and install dependencies (make sure you have npm and node)

  ```
  cd property-finder-backend
  ```
  ```
  npm install
  ```
- Create a `.env` file at root directory (same as `.env.sample`)

   Copy this data and paste it in `.env`
  
  ```
  MONGODB_URI=mongodb+srv://pythonpioneer:DU02ug4xveJ8eX1S@todo-app.mwl8uow.mongodb.net/Property?retryWrites=true&w=majority
  SIGNATURE=thisisauniquesignaturelmao

  CLOUDINARY_CLOUD_NAME=hrk
  CLOUDINARY_API_KEY=331295534557971
  CLOUDINARY_API_SECRET=OuBuneJz0Xl4fZL86dP77Yo6jNA
  ```

- After installation, To start the app

      npm run dev
  **Note:** If the app didn't run with the given command then please explore nodemon for your machine.
  
- It will run on 4000

  To verify the port run this command on your browser
  
      http://localhost:4000/api/v1/health


## Frontend Setup

- Clone the frontend repo

      https://github.com/pythonpioneer/property-finder-frontend.git

- Go to your project folder and install dependencies (make sure you have npm and node)

  ```
  cd property-finder-frontend
  ```
  ```
  npm install
  ```
  
- Create a `.env` file at root directory (same as `.env.sample`)

   Copy this data and paste it in `.env`
  
  ```
  REACT_APP_URL=http://localhost:4000
  ```

- After installation, To start the app

      npm start

- It will run on port 3000
  
