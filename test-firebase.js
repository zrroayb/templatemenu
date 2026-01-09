// Firebase connection test script
// Run with: node test-firebase.js

const fs = require("fs");
const path = require("path");

console.log("🔥 Firebase Connection Test\n");

// Check if .env.local exists
const envPath = path.join(__dirname, ".env.local");
if (!fs.existsSync(envPath)) {
  console.error("❌ .env.local file not found!");
  console.log("\nPlease create .env.local file with your Firebase config:");
  console.log(`
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyATMAiRwHa2FtJ7f7AXjZ7WcxoJQSKFPJ8
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=template-3f7fa.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=template-3f7fa
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=template-3f7fa.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=932800525212
NEXT_PUBLIC_FIREBASE_APP_ID=1:932800525212:web:89ad3c8eae430ea0b44e59
  `);
  process.exit(1);
}

console.log("✅ .env.local file found");

// Read and parse .env.local
const envContent = fs.readFileSync(envPath, "utf8");
const envVars = {};
envContent.split("\n").forEach((line) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#")) {
    const [key, ...valueParts] = trimmed.split("=");
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join("=").trim();
    }
  }
});

// Check required variables
const requiredVars = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
];

console.log("\n📋 Checking environment variables:");
let allPresent = true;
requiredVars.forEach((varName) => {
  if (envVars[varName]) {
    const value = envVars[varName];
    const displayValue =
      varName.includes("KEY") || varName.includes("ID")
        ? value.substring(0, 20) + "..."
        : value;
    console.log(`  ✅ ${varName}: ${displayValue}`);
  } else {
    console.log(`  ❌ ${varName}: MISSING`);
    allPresent = false;
  }
});

if (!allPresent) {
  console.error("\n❌ Some required environment variables are missing!");
  process.exit(1);
}

console.log("\n✅ All environment variables present");

// Test Firebase connection (requires dynamic import for ES modules)
async function testFirebase() {
  try {
    console.log("\n🔌 Testing Firebase connection...");

    // Import Firebase dynamically
    const { initializeApp, getApps } = await import("firebase/app");
    const { getFirestore, collection, getDocs } = await import(
      "firebase/firestore"
    );

    const config = {
      apiKey: envVars.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: envVars.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: envVars.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: envVars.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: envVars.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: envVars.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    // Initialize Firebase
    let app;
    if (!getApps().length) {
      app = initializeApp(config);
      console.log("  ✅ Firebase app initialized");
    } else {
      app = getApps()[0];
      console.log("  ✅ Firebase app already initialized");
    }

    // Test Firestore connection
    const db = getFirestore(app);
    console.log("  ✅ Firestore instance created");

    // Try to read from Firestore
    try {
      const categoriesRef = collection(db, "categories");
      const snapshot = await getDocs(categoriesRef);
      console.log(`  ✅ Successfully connected to Firestore!`);
      console.log(
        `  📊 Found ${snapshot.size} category/categories in database`
      );

      if (snapshot.size > 0) {
        console.log("\n📋 Categories in database:");
        snapshot.forEach((doc) => {
          console.log(`  - ${doc.id}: ${doc.data().title || "No title"}`);
        });
      } else {
        console.log("\n⚠️  No categories found. Database is empty.");
        console.log(
          "   You can add categories via admin panel or Firebase Console."
        );
      }

      console.log("\n✅ Firebase connection test PASSED!");
      process.exit(0);
    } catch (firestoreError) {
      console.error(
        "  ❌ Error connecting to Firestore:",
        firestoreError.message
      );
      if (firestoreError.code === "permission-denied") {
        console.error(
          "\n⚠️  Permission denied. Check your Firestore security rules."
        );
        console.error(
          "   Make sure read access is allowed for the categories collection."
        );
      }
      process.exit(1);
    }
  } catch (error) {
    console.error("\n❌ Firebase connection test FAILED!");
    console.error("Error:", error.message);
    if (error.message.includes("API key")) {
      console.error("\n⚠️  Invalid API key. Check your .env.local file.");
    } else if (error.message.includes("project")) {
      console.error("\n⚠️  Invalid project ID. Check your .env.local file.");
    }
    process.exit(1);
  }
}

testFirebase();
