
/*
    Using Unsplash API to get n images
    Returning dictionary that contains:
    - Image ID
    - URL
    - Number of likes
    - Number of views
    - Number of downloads
    - Name (Name + Surname)
    - Username
    - User Profile Image URL
*/

const getImages = async (imagesPerFetch) => {

    return await fetch(`https://api.unsplash.com/photos/random?count=${imagesPerFetch}&client_id=mUtTp675q_8PIvE1kxbrwFxM4gWCwOmk8Dg-FItst4M`)
        .then( (response) => {
            return response.json();
        })
      .then( (data) => {

        let information = {}
        for(let i = 0; i < imagesPerFetch; i++){

            information[i] = {
                id: data[i].id,
                url: data[i].urls.thumb,
                fullSize: data[i].urls.small,
                likes: data[i].likes,
                views: data[i].views,
                downloads: data[i].downloads,
                name: data[i].user.name,
                username: data[i].username,
                userProfileImage: data[i].user.profile_image.large
            }
        }

        return information

      }).catch(function(error) {
        
        console.log(error)
      });

    
}

/*
    Creating a template function for image addition
*/
const addElements = async (pageNumber, imagesPerFetch) => {

    let data = await getImages(imagesPerFetch)
    for(let i = 0; i < imagesPerFetch; i++){
        document.getElementById("images-container").innerHTML += 
        `
            <section class='image-card'>
                <section class="avatar-and-name">
                    <img src='${data[i].userProfileImage}' class='avatar'/>
                    <p class="user-name">${data[i].name ? data[i].name : data[i].username}</p>
                </section>
                <hr/>
                <img large=${data[i].fullSize} class="image" id="image${pageNumber}_${i}" src="${data[i].url}" />
                <section class="likes-downloads">
                    <p class="category">Views</p>
                    <p class="category">Likes</p>
                    <p class="category">Downloads</p>
                    <p class="numbers">${data[i].views}</p>
                    <p class="numbers">${data[i].likes}</p>
                    <p class="numbers">${data[i].downloads}</p>
                </section>
                <a class="unsplash" target="_blank" href="https://unsplash.com/photos/${data[i].id}">View it on Unsplash</a>
            </section>
        `        
    }
}

/*
    Function that loads images from unsplash to HTML
*/
const loadElements = async (pageNumber, imagesPerFetch) => {

    await addElements(pageNumber, imagesPerFetch)
    setTimeout(() => 
        {}, 2000)

    for(let i = 0; i < imagesPerFetch; i++) 
        
    // Adding event listeners so users can click on the photo for full screen
    document.getElementById(`image${pageNumber}_${i}`).addEventListener("click", (e) => {
            
        let src = document.getElementById(`image${pageNumber}_${i}`).getAttribute("large")
            document.getElementById("full-size-image").classList.remove("hidden")
            document.getElementById("full-size-image").innerHTML = `
                <p class="close" id="close">close</p>
                <img src="${src}">
            `
        document.getElementById("close").addEventListener("click", function(){
            document.getElementById("full-size-image").classList.add("hidden")
        })
        
    })


}

// On load, initial batch of images is downloaded
window.onload = () => {

    document.getElementById("loading").classList.toggle("loading-hidden");
    loadElements(1, 15)
    setTimeout(() => {
        document.getElementById("loading").classList.toggle("loading-hidden");
    }, 2000)    
}

// When jump button is clicked, window is scrolled to the beginning
document.getElementById("jump").addEventListener("click", () => {

    window.scrollTo({ top: 0, behavior: 'smooth' });
})

// When user have scrolled to the bottom, new images are loaded
let pageNumber = 2
window.addEventListener("scroll", () => {

    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {

        document.getElementById("jump").classList.add("jump-before-footer")
    }
    else {
        document.getElementById("jump").classList.remove("jump-before-footer")
    }

    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        document.getElementById("loading").classList.toggle("loading-hidden");
        loadElements(pageNumber, 15)
        pageNumber += 1
        setTimeout(() => {
            document.getElementById("loading").classList.toggle("loading-hidden");
        }, 2000) 
    }
})

/*
    Creating button change layout functionality
*/ 

document.getElementById("change-layout").addEventListener("click", function(){

    if(document.getElementById("change-layout").innerHTML === "List Layout") {
        document.getElementById("change-layout").innerHTML = "Grid Layout"
    } else {
        document.getElementById("change-layout").innerHTML = "List Layout"
    }
    document.getElementById("images-container").classList.toggle("images-container-list")
})




