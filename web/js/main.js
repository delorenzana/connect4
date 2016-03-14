var game_ended = false;
var player = 1;
var player_is_comp = false;
var slots = [];
var max_x = 6;
var max_y = 5;
var connections_total = 4;

var take_slot = function(slot){
    var x = slot.data('x');
    var y = slot.data('y');
    if(slots[x][y] != 0) return;
    var lowest_slot = get_lowest_slot(x);
    if(lowest_slot == y){
        slots[x][y] = player;
        if(player == 1){ slot.addClass('red'); }else{ slot.addClass('yellow'); }
        var connections = check_connections(x,y); 
        if(connections){
            announce_winner(connections);
        }else{
            player = (player == 1) ? 2:1;
            if((player == 2) && player_is_comp){
                pc_take_slot();
            }
        }
    }
}

var get_lowest_slot = function(x){
    var lowest_y = null;
    for (var y = 0; y <= max_y; y++) {
        if(slots[x][y] == 0){
            lowest_y = y;
            break;
        }
    }
    return lowest_y;
}

var pc_take_slot = function(){
    var rand_x = Math.ceil(Math.random()*max_x);
    var lowest_slot = get_lowest_slot(rand_x);
    if(lowest_slot !== null){
        $('.circle[data-x="'+rand_x+'"][data-y="'+lowest_slot+'"]').click();
    }else{
        while (true){
            rand_x = Math.ceil(Math.random()*max_x);
            lowest_slot = get_lowest_slot(rand_x);
            if(lowest_slot !== null){
                $('.circle[data-x="'+rand_x+'"][data-y="'+lowest_slot+'"]').click();
                break;
            }
        }
    }
}

var check_connections = function(x,y){
    var connections = [];
    // vertical
    for (var i = y; i >= 0; i--) {
        if(slots[x][i] == player){
            connections.push([x,i]);
            if(connections.length == connections_total) return connections;
        }else{
            connections = [];
        }
    }
    
    connections = [];
    // horizontal
    for (var i = 0; i <= max_x; i++) {
        if(slots[i][y] == player){
            connections.push([i,y]);
            if(connections.length == connections_total) return connections;
        }else{
            connections = [];
        }
    }
    
    connections = [];
    // diagonal right
    var r = x;
    var u = y;
    while ((r <= max_x) && (u <= max_y)) {
        if(slots[r][u] == player){
            connections.push([r,u]);
            r++;
            u++;
        }else{
            break;
        }
    }
    var l = x-1;
    var d = y-1;
    while ((l >= 0) && (d >= 0)) {
        if(slots[l][d] == player){
            connections.push([l,d]);
            l--;
            d--;
        }else{
            break;
        }
    }
    if(connections.length == connections_total) return connections;
    
    connections = [];
    // diagonal left
    l = x;
    u = y;
    while ((l >= 0) && (u <= max_y)) {
        if(slots[l][u] == player){
            connections.push([l,u]);
            l--;
            u++;
        }else{
            break;
        }
    }
    r = x+1;
    d = y-1;
    while ((r <= max_x) && (d >= 0)) {
        if(slots[r][d] == player){
            connections.push([r,d]);
            r++;
            d--;
        }else{
            break;
        }
    }
    if(connections.length == connections_total) return connections;
    
    return false;
}

var announce_winner = function(connections){
    game_ended = true;
    if(player == 1){
        $('#message').html('Red wins!');
    }else{
        if(player_is_comp){
            $('#message').html('Computer wins!');
        }else{
            $('#message').html('Yellow wins!');
        }
    }
    for(i in connections){
        $('.circle[data-x="'+connections[i][0]+'"][data-y="'+connections[i][1]+'"]').animate({
            opacity: 0.05
          }, 2000, function() {
            $(this).animate({
                opacity: 1
              }, 2000, function() {
                // Animation complete.
              });
          }).addClass('circle-border');
    }
}

var restart = function(){
    game_ended = false;
    player = 1;
    $('#message').html("Let's play!");
    slots = [];
    for (var i = 1; i <= 7; i++) {
        slots.push([0,0,0,0,0,0]);
    }
    $('.circle').removeClass('red').removeClass('yellow').removeClass('circle-border');
}

$(document).ready(function(){
    restart();
    $('.circle').click(function(){
        if(game_ended) return;
        take_slot($(this));
    });
    $('#restart').click(function(){
        restart();
    });
    $('#vs_pc').click(function(){
       player_is_comp = true;
       if(player == 2) pc_take_slot();
            
    });
    $('#vs_p2').click(function(){
       player_is_comp = false;
    });
});