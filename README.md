
# Drinks Shop Editor Web App

This project is a SvelteKit-based web application designed to manage and visualize data from Google Sheets. It connects to your Google Drive, allows you to search and select a sheet, edit its content directly within the app, and view simple real-time visualizations.

## Features
- **Google Drive Integration**: Search for and select Google Sheets stored in your Drive.
- **Sheet Editing**: Edit the content of a selected sheet within the web app.
- **Real-Time Visualization**: Display simple visualizations of the sheet data to gain insights quickly.
- **Drinks Shop Example**: Pre-configured to work with a drinks shop dataset.

## Prerequisites
Before you begin, ensure you have the following:

- Node.js (v16 or higher) and npm installed.
- A Google Cloud project with the Google Sheets and Google Drive APIs enabled.
- OAuth 2.0 credentials (Client ID and Client Secret) for authenticating with Google.

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Chulinuwu/drinkme
cd drinkme
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the project root with the following:

```bash
SECRET_CLIENT_ID=your_client_id
SECRET_CLIENT_SECRET=your_client_secret
REDIRECT_URL=your_url_example_http://localhost:5173
```
Replace `your-client-id`, `your-client-secret`, and `your-redirect-uri` with your actual Google Cloud OAuth 2.0 credentials.

### 4. Create Google Client ID and Secret
1. Visit the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Navigate to **APIs & Services > Credentials**.
4. Click **Create Credentials** and choose **OAuth Client ID**.
   - Configure the consent screen if prompted.
5. Choose **Web Application** as the application type.
6. Enter a name (e.g., "Drinks Shop Editor Web App").
7. Add the following to the **Authorized redirect URIs**:
   - `http://localhost:5173`
   - Your production URL if applicable (e.g., `https://yourdomain.com`).
8. Click **Create** and save the generated Client ID and Secret.

### 5. Run the Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to access the app.

## How It Works

1. **Authentication**: Log in using your Google account to grant the app access to your Google Drive.
2. **Search for Sheets**: Use the search functionality to find a specific Google Sheet in your Drive.
3. **Select and Edit**: Choose a sheet, then view and modify its data directly within the app.
4. **Visualize Data**: View a real-time visualization of your sheet data for insights.

## Example Use Case: Drinks Shop
The app is configured to manage a drinks shop dataset, including columns for drink names, prices, and inventory levels. Real-time visualizations help track trends and insights.

## Deployment
To deploy the app:

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `build` folder to your preferred hosting service (e.g., Vercel, Netlify).

## Future Enhancements
- Add user roles and permissions.
- Integrate advanced data visualizations.
- Enable offline access with service workers.

## Contributing
Feel free to submit issues or pull requests to improve the app.

## License
This project is licensed under the MIT License. See the `LICENSE` file for more details.
