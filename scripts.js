
    // Firebase configuration (replace with your Firebase project config)
    var firebaseConfig = {
        apiKey: "AIzaSyB-isfaLP9MHQHdGEOv9PWpx1fOAjDIgFM",
    authDomain: "project-adsense-26c65.firebaseapp.com",
    databaseURL: "https://project-adsense-26c65-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "project-adsense-26c65",
    storageBucket: "project-adsense-26c65.appspot.com",
    messagingSenderId: "608324017972",
    appId: "1:608324017972:web:33854fa5315d39b1bacf61",
    measurementId: "G-P86JZRCWQT"
    };
    
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    populateCategories();

    // Get a reference to the Firebase Realtime Database
        var storage = firebase.storage();
        var database = firebase.database();

    // Function to add a category to Firebase
    function addCategory() {
        var newCategoryInput = document.getElementById('newCategory');
        var newCategory = newCategoryInput.value.trim();

        if (newCategory !== "") {
            var categoryRef = database.ref('wallpapers/categories').push();
            categoryRef.set(newCategory, function(error) {
                if (error) {
                    console.error("Error adding category: " + error);
                } else {
                    console.log("Category added successfully: " + newCategory);
                    newCategoryInput.value = ""; // Clear the input field
                    populateCategories(); // Update the category dropdown
                }
            });
        }
    }
    function populateCategories() {
        var categorySelect = document.getElementById('categorySelect');
        categorySelect.innerHTML = ""; // Clear existing options
    
        // Reference to the "categories" node in Firebase Realtime Database
        var categoriesRef = firebase.database().ref('wallpapers/categories');
    
        categoriesRef.on('child_added', function(snapshot) {
            var category = snapshot.val();
            var option = document.createElement('option');
            option.value = category;
            option.text = category;
            categorySelect.appendChild(option);
        });
    }

    // Attach the addCategory function to the button click event
    var addCategoryButton = document.getElementById('addCategoryButton');
    addCategoryButton.addEventListener('click', addCategory);

    function uploadImageWithCategory() {
        populateCategories();
        var imageUploadInput = document.getElementById('imageUpload');
        var category = document.getElementById('categorySelect').value;

        if (imageUploadInput.files.length === 0 || category === "") {
            alert("Please select an image and a category.");
            return;
        }

        var imageFile = imageUploadInput.files[0];

        // Create a unique key for the image data
        var imageKey = database.ref().child('wallpapers').child('images').push().key;

        // Create a reference to the Firebase Storage bucket
        var storageRef = storage.ref('wallpapers/images/' + category + '_' + imageFile.name);

        // Upload the image to Firebase Storage
        var uploadTask = storageRef.put(imageFile);

        uploadTask.on('state_changed', function(snapshot) {
            // Handle progress or state changes if needed
        }, function(error) {
            console.error("Error uploading image: " + error);
        }, function() {
            // Image upload successful, get the download URL
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                // Save the image data to Firebase Realtime Database
                var imageData = {
                    imageUrl: downloadURL,
                    category: category
                };


                database.ref('wallpapers/images/' + category).set(imageData)
                    .then(function() {
                        console.log("Image uploaded with category: " + category);
                        imageUploadInput.value = ""; // Clear the input field
                    })
                    .catch(function(error) {
                        console.error("Error saving image data: " + error);
                    });
            });
        });
    }

    // Attach the uploadImageWithCategory function to the "Upload Image" button click event
    var uploadButton = document.getElementById('uploadButton');
    uploadButton.addEventListener('click', uploadImageWithCategory);



