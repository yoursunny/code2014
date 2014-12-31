// ----------------------------------------------------------------
// operator key

var operator_key_ready = $.Deferred();
var operator_key_json = window.localStorage['NDNSF_operator_key_'+config.ndndid];
var operator_key = new ndn.Key();
if (operator_key_json) {
  var keypair = JSON.parse(operator_key_json);
  operator_key.fromPemString(keypair.pubkey, keypair.pvtkey);
  operator_key_ready.resolve();
} else {
  $('#connection_status').text('requesting new operator key');
  $.getJSON('?p=keypair', function(keypair){
    operator_key.fromPemString(keypair.pubkey, keypair.pvtkey);
    $.ndn('key', operator_key);
    window.localStorage['NDNSF_operator_key_'+config.ndndid] = JSON.stringify(keypair);
    operator_key_ready.resolve();
  });
}

// ----------------------------------------------------------------
// connection

var ndn_ready = $.Deferred(), ndn_close = $.Deferred();
operator_key_ready.done(function(){
  $('#connection_status').text('connecting');
  $.ndn('open', { host:config.hostname, port:config.port });
});
$.ndn.on('open', function(){
  if (config.ndndid != $.ndn('ndndid').toString('hex')) {
    $('#connection_status').text('NDNDID mismatch').removeClass('alert-info').addClass('alert-error');
    return;
  }

  var co = new ndn.ContentObject(new ndn.Name([]), '');
  co.sign(operator_key);
  $('#connection_status').text('connection established, verifying operator key');
  $.ndn.interest(new ndn.Name('ndnx').add($.ndn('ndndid')).add('verify_operator_key').add(co.encodeToBinary()))
    .done(function(){
      ndn_ready.resolve();
    })
    .fail(function(){
      $('#connection_status').html('operator key not trusted, please add <tt>'+operator_key.publicKeyDigest.toString('hex')+'</tt> to config/operators.txt and restart NDNSF, or replace operator key <input type="file" id="operator_key_replace">').removeClass('alert-info').addClass('alert-error');
      $('#operator_key_replace').on('change', function(){
        if (this.files.length == 0) return;
        var reader = new FileReader();
        reader.readAsText(this.files[0], 'utf8');
        reader.onload = function(){
          var keypair;
          try {
            keypair = JSON.parse(reader.result);
            operator_key.fromPemString(keypair.pubkey, keypair.pvtkey);
          } catch(ex) {
            $('#connection_status').html('cannot parse chosen operator key file')
            return;
          }
          window.localStorage['NDNSF_operator_key_'+config.ndndid] = JSON.stringify(keypair);
          $('#connection_status').html('operator key replaced, please refresh').removeClass('alert-error').addClass('alert-info');
        };
      });
    });
});
$.ndn.on('close', function(){ ndn_close.resolve(); });

ndn_ready.done(function(){
  $('#connection_status').text('connected to '+config.host).removeClass('alert-info').addClass('alert-success');
  $('.ready-enable').prop('disabled',false);
});
ndn_close.done(function(){
  $('#connection_status').text('connection lost').removeClass('alert-info alert-success').addClass('alert-error');
  $('.ready-enable').prop('disabled',true);
  $('.close-hide').hide();
});


// ----------------------------------------------------------------
// ping

ndn_ready.done(function(){
  $('#ping_uri').val('ndn:/ndnx/'+ndn.Name.toEscapedString($.ndn('ndndid')));
});
var ping_job = 0;
$('#ping').on('submit', function(){
  var base_name = new ndn.Name($('#ping_uri').val()).add('ping');
  $('#ping_result').html('');
  var job = ping_job = Date.now();
  var count = 16;
  var start = Date.now();
  ping_once();
  return false;

  function ping_once() {
    var name = new ndn.Name(base_name).add(''+Math.floor(99999999*Math.random()))
    $.ndn.interest(name).done(function(){
      var end = Date.now();
      $('#ping_result').append(' <span class="label label-success">'+(end-start)+'ms</span>');
    }).fail(function(){
      $('#ping_result').append(' <span class="label label-warning">timeout</span>');
    }).always(ping_next);
  }
  function ping_next() {
    start = Date.now();
    if (ping_job == job && --count > 0) {
      start = Date.now();
      ping_once();
    }
  }
});


// ----------------------------------------------------------------
// facelist

var loading_facelist = false;
function load_facelist() {
  if (loading_facelist) return;
  loading_facelist = true;
  $('#facelist i.icon-refresh').hide();
  $.when($.ndn.interest(new ndn.Name('ndnx').add($.ndn('ndndid')).add('faces')),
      $.ndn.interest(new ndn.Name('ndnx').add($.ndn('ndndid')).add('fib'))).done(function(a1,a2){
    var facelist = JSON.parse(a1[1].content.toString());
    var fiblist = JSON.parse(a2[1].content.toString());
    facelist.unshift({ id:0, desc:'internal handler' });
    var table = '<table class="table table-bordered"><thead><tr><th class="span1"><i class="icon-refresh close-hide"></i><th class="span5">description<th class="span1">sent Interest<th class="span1">sent CO<th class="span1">recv Interest<th class="span1">recv CO<tr><th>ID<th colspan="5">prefixes<tbody>' + facelist.map(function(face){
      var row = '<tr><td rowspan="2">'+face.id+'<td>'+face.desc;
      if (face.counters) {
        row += '<td>'+face.counters.SI+'<td>'+face.counters.SC+'<td>'+face.counters.RI+'<td>'+face.counters.RC;
      } else {
        row += '<td>-<td>-<td>-<td>-';
      }
      row += '<tr><td colspan="5">'+fiblist.filter(function(fe){
        return fe.faceids.indexOf(face.id) >= 0;
      }).map(function(fe){ return fe.prefix; }).join('<br>');
      return row;
    }).join('') + '</table>';
    $('#facelist').html(table);
    $('#facelist i.icon-refresh').on('click', load_facelist);
    loading_facelist = false;
  }).fail(function(){ loading_facelist = false; $('#facelist i.icon-refresh').show() });
}
ndn_ready.done(load_facelist);

