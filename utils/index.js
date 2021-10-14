
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
const getImages = async (pageNumber, imagesPerPage) => {

    return await fetch(`https://api.unsplash.com/photos?page=${pageNumber};per_page=${imagesPerPage};client_id=DdjQErY4NabMYW4pWNn2JEhVAvgVE6MdGgFcAvgXNxA`)
        .then( (response) => {
            return response.json();
        })
      .then( async (data) => {

        let information = {}
        for(let i = 0; i < imagesPerPage; i++){

            let statisticsDictionary = await fetch(`https://api.unsplash.com/photos/${data[i].id}?client_id=iGeXjIvO4B_aNDWvxdUWtOlsbp9DCmWevWB9ClumQWA`)
            .then( (res) => {
                return res.json();
            })
            .then( (d) => {

                return {
                    likes: d.likes,
                    downloads: d.downloads,
                    views: d.views
                }

            }).catch(function(err) {
                
                console.log(err)
            });

            information[i] = {
                id: data[i].id,
                url: data[i].urls.thumb,
                fullSize: data[i].urls.small,
                likes: statisticsDictionary.likes,
                views: statisticsDictionary.views,
                downloads: statisticsDictionary.downloads,
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
const addElements = async (pageNumber, imagesPerPage) => {

    let data = await getImages(pageNumber, imagesPerPage)
    for(let i = 0; i < imagesPerPage; i++){
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

const loadElements = async (pageNumber, imagesPerPage) => {

    await addElements(pageNumber, imagesPerPage)
    setTimeout(() => 
        {}, 2000)

    for(let i = 0; i < imagesPerPage; i++) 
        
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

window.onload = () => {

    document.getElementById("loading").classList.toggle("loading-hidden");
    loadElements(1, 15)
    setTimeout(() => {
        document.getElementById("loading").classList.toggle("loading-hidden");
    }, 2000)    
}

document.getElementById("jump").addEventListener("click", () => {

    window.scrollTo({ top: 0, behavior: 'smooth' });
})

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
        setTimeout(() => {
            document.getElementById("loading").classList.toggle("loading-hidden");
        }, 2000) 
        pageNumber += 1
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




