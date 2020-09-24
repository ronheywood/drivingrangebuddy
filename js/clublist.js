var clubList = $('[data-bind="club-selection"]');
var unorderedList = $('<div class="clubList">');
console.log(unorderedList);
options.clubs.map(function(club){
  unorderedList.append($('<button class="btn btn-secondary">'+club+'</button>'));
});

clubList.append(unorderedList);

clubList.on('click','button',function(){
  $(window).trigger('club-selection:changed',{club: this.innerHTML});
});