let apiKey = "AIzaSyB7pUyk418gC0y4-umrnMwXI1p7Pd_qEWQ";
var searchQuery;
var previousPage;
var nextPage;

function fetch(query, callback){
    console.log(query);
    $.ajax({
        url: "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10",
        method: "GET",
        data: {
            key : apiKey,
            q : query
        },
        dataType: "json",
        success: responseJson => callback(query, responseJson),
        error : err => console.log(err)
    });
}

function fetchPage(query, page, callback){
    $.ajax({
    url: "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10",
    method: "GET",
    data: {
        key : apiKey,
        q : query,
        pageToken: page
    },
    dataType: "json",
    success: responseJson => callback(query, responseJson),
    error : err => console.log(err)
})
}

function display(query, data){
    $("#results").html("");
    if(data.items.length == 0){
        $("#results").append("No results");
        return;
    }
    data.items.forEach(item => {
        $("#results").append(`
            <a href="https://www.youtube.com/watch?v=${item.id.videoId}">
                <h4>${item.snippet.title}</h4>
                <img src="${item.snippet.thumbnails.medium.url}" alt="thumbnail">
            </a>
        `);
    });
    if(data.prevPageToken){
        $("#results").append(
            $("<button/>", {
                text: "Previous page",
                click: function(){
                    fetchPage(query, data.prevPageToken, display);
                }
            })
        )
    };
    $("#results").append(
        $("<button/>", {
            text: "Next page",
            click: function(){
                fetchPage(query, data.nextPageToken, display);
            }
        })
    );
}

$('#query').keyup(function(e){
    if(e.keyCode == 13)
    {
        fetch($("#query").val(), display);
    }
});

$("#searchButton").click(function(){
    fetch($("#query").val(), display);
})
