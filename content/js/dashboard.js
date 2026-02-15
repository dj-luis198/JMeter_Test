/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 69.29392446633825, "KoPercent": 30.70607553366174};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5336134453781513, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=065aee98-8c0d-41de-ae1a-c6c71dd898ee"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd6571ba-fb9a-4fd5-8ab6-4ac517ea6506"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3299f826-f7f2-4055-8a90-15ac7ac534b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bbd7d07d-ba0e-462c-8aa4-dd0ddf6f35de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1e4354f3-78be-4f5f-b3e5-d9b0217dc17b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/19b6537b-104a-4997-aee9-9e974aa84b7d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19b6537b-104a-4997-aee9-9e974aa84b7d"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.36, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b685adc0-f14c-4c3a-b5e0-73c6656dca20"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.43478260869565216, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d409ba0e-6a40-4ba5-a6ec-9d4d88e4dae6"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c01d745f-9e2e-4a3a-b59e-110b5941ab4a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fd6571ba-fb9a-4fd5-8ab6-4ac517ea6506"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/065aee98-8c0d-41de-ae1a-c6c71dd898ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=43865552-d9c9-4bbf-b207-6fedebd6a56b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bbd7d07d-ba0e-462c-8aa4-dd0ddf6f35de"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/43865552-d9c9-4bbf-b207-6fedebd6a56b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8817c000-95c5-4cb3-bb67-772c6d448ad5"], "isController": false}, {"data": [0.90625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8817c000-95c5-4cb3-bb67-772c6d448ad5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2816da7f-ff81-4cef-9f71-6c3a33a4c554"], "isController": false}, {"data": [0.9670658682634731, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6ba9bec9-4ae6-480f-9113-91243636a201"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6ba9bec9-4ae6-480f-9113-91243636a201"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d409ba0e-6a40-4ba5-a6ec-9d4d88e4dae6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cddb73cd-bb33-440f-aa64-157276b6683e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd703512-4cfd-45a4-ae31-884be23e4f4b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e808a659-9a62-4922-bc6d-bd564a728746"], "isController": false}, {"data": [0.7608695652173914, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c80a0a37-ad57-41b0-816a-a542ff27ffc3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c01d745f-9e2e-4a3a-b59e-110b5941ab4a"], "isController": false}, {"data": [0.08695652173913043, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e808a659-9a62-4922-bc6d-bd564a728746"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fd703512-4cfd-45a4-ae31-884be23e4f4b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c80a0a37-ad57-41b0-816a-a542ff27ffc3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e4354f3-78be-4f5f-b3e5-d9b0217dc17b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b685adc0-f14c-4c3a-b5e0-73c6656dca20"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=984da1f9-da7c-4e29-b392-e05030feae0f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cddb73cd-bb33-440f-aa64-157276b6683e"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/984da1f9-da7c-4e29-b392-e05030feae0f"], "isController": false}, {"data": [0.36, 500, 1500, "register"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 609, 187, 30.70607553366174, 258.36453201970465, 81, 2500, 93.0, 633.0, 952.0, 1810.299999999997, 2.412263328844173, 2.5565351008575616, 1.1600576885942326], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 59, 100.0, 493.16949152542355, 336, 1043, 517.0, 644.0, 672.0, 1043.0, 0.2655086290304435, 1.7068562540782575, 0.4457122395540355], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 100.3125, 85, 250, 89.0, 147.8000000000001, 250.0, 250.0, 0.0744442273154481, 0.057796055386505125, 0.026462596428538196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 13, 100.0, 123.46153846153845, 82, 252, 86.0, 250.8, 252.0, 252.0, 0.07389764607575078, 0.036732326027887834, 0.03709315437786708], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=065aee98-8c0d-41de-ae1a-c6c71dd898ee", 1, 0, 0.0, 344.0, 344, 344, 344.0, 344.0, 344.0, 344.0, 2.9069767441860463, 0.5251862281976745, 2.0042242005813957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 21, 100.0, 115.33333333333336, 82, 362, 86.0, 256.0, 351.59999999999985, 362.0, 0.1314652743868084, 0.06534748502234909, 0.06598940530744093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd6571ba-fb9a-4fd5-8ab6-4ac517ea6506", 1, 0, 0.0, 374.0, 374, 374, 374.0, 374.0, 374.0, 374.0, 2.6737967914438503, 0.4830589906417112, 1.8434575534759359], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3299f826-f7f2-4055-8a90-15ac7ac534b2", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 1.3034119897959184, 2.4354272959183674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bbd7d07d-ba0e-462c-8aa4-dd0ddf6f35de", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e4354f3-78be-4f5f-b3e5-d9b0217dc17b", 3, 0, 0.0, 313.3333333333333, 231, 465, 244.0, 465.0, 465.0, 465.0, 0.019157577460471534, 0.02641026710452374, 0.012285295441773736], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19b6537b-104a-4997-aee9-9e974aa84b7d", 3, 0, 0.0, 300.33333333333337, 164, 567, 170.0, 567.0, 567.0, 567.0, 0.06396042981408835, 0.041536802564813236, 0.04101629125447723], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19b6537b-104a-4997-aee9-9e974aa84b7d", 1, 0, 0.0, 354.0, 354, 354, 354.0, 354.0, 354.0, 354.0, 2.824858757062147, 0.510350459039548, 1.947607697740113], "isController": false}, {"data": ["https://demoqa.com/books", 59, 59, 100.0, 154.93220338983056, 82, 757, 87.0, 344.0, 382.0, 757.0, 0.25781079309591437, 0.128150091490059, 0.1246253345532008], "isController": false}, {"data": ["deleteBook", 16, 0, 0.0, 605.125, 349, 2255, 457.0, 1225.300000000001, 2255.0, 2255.0, 0.10646013400669367, 0.019233520303943683, 0.07235962233267461], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 0, 0.0, 605.125, 349, 2255, 457.0, 1225.300000000001, 2255.0, 2255.0, 0.10345875552049454, 0.018691279073526842, 0.07031962289283612], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 6, 24.0, 835.04, 139, 1980, 788.0, 1431.4, 1820.9999999999995, 1980.0, 0.10655301012253596, 0.03364744272775706, 0.04807372136387853], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b685adc0-f14c-4c3a-b5e0-73c6656dca20", 3, 0, 0.0, 571.0, 185, 1317, 211.0, 1317.0, 1317.0, 1317.0, 0.08147967082212988, 0.03829968901925636, 0.05225096078111844], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 92.42857142857142, 84, 115, 88.0, 115.0, 115.0, 115.0, 0.03715715885747045, 0.029246748085079276, 0.013208208812616447], "isController": false}, {"data": ["deleteAccount", 15, 0, 0.0, 655.4666666666667, 349, 1625, 546.0, 1440.2, 1625.0, 1625.0, 0.10899578549629414, 0.019691621403139077, 0.07418951415128615], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1159.5652173913045, 678, 2500, 964.0, 1901.8000000000006, 2408.9999999999986, 2500.0, 0.10132113955445131, 0.05244160543345624, 0.04660376633803375], "isController": false}, {"data": ["goToProfile", 16, 0, 0.0, 231.125, 159, 481, 196.0, 381.6000000000001, 481.0, 481.0, 0.1076035347761174, 0.21217283901838677, 0.06956400392752903], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 7, 100.0, 130.14285714285714, 83, 370, 88.0, 370.0, 370.0, 370.0, 0.03490610258404891, 0.017350787319610247, 0.017521227273633925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d409ba0e-6a40-4ba5-a6ec-9d4d88e4dae6", 1, 0, 0.0, 338.0, 338, 338, 338.0, 338.0, 338.0, 338.0, 2.9585798816568047, 0.5345090606508875, 2.0398021449704142], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c01d745f-9e2e-4a3a-b59e-110b5941ab4a", 3, 0, 0.0, 478.33333333333337, 253, 843, 339.0, 843.0, 843.0, 843.0, 0.02540155626868073, 0.02547597489056163, 0.01628940945615268], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd6571ba-fb9a-4fd5-8ab6-4ac517ea6506", 3, 0, 0.0, 353.3333333333333, 193, 481, 386.0, 481.0, 481.0, 481.0, 0.06015761294591831, 0.03867554868756141, 0.038577635906073916], "isController": false}, {"data": ["addBook", 54, 54, 100.0, 593.9074074074074, 337, 2100, 560.5, 772.5, 965.25, 2100.0, 0.26323871364015267, 0.8966378261844523, 0.5145760820817308], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/065aee98-8c0d-41de-ae1a-c6c71dd898ee", 3, 0, 0.0, 230.66666666666666, 161, 349, 182.0, 349.0, 349.0, 349.0, 0.05598686174977605, 0.035994157537697816, 0.035903033088235295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=43865552-d9c9-4bbf-b207-6fedebd6a56b", 1, 0, 0.0, 164.0, 164, 164, 164.0, 164.0, 164.0, 164.0, 6.097560975609756, 1.101610137195122, 4.203982469512195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bbd7d07d-ba0e-462c-8aa4-dd0ddf6f35de", 3, 0, 0.0, 877.6666666666666, 177, 1999, 457.0, 1999.0, 1999.0, 1999.0, 0.02406854722248965, 0.024139060544430536, 0.015434582691505407], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/43865552-d9c9-4bbf-b207-6fedebd6a56b", 3, 0, 0.0, 307.66666666666663, 173, 574, 176.0, 574.0, 574.0, 574.0, 0.09187798603454612, 0.0415723960247458, 0.05891915120053902], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 126.85714285714286, 84, 459, 89.0, 323.20000000000005, 447.1999999999998, 459.0, 0.12702944663553437, 0.09489992839471073, 0.04515499860872511], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8817c000-95c5-4cb3-bb67-772c6d448ad5", 3, 0, 0.0, 292.0, 161, 546, 169.0, 546.0, 546.0, 546.0, 0.03636099192785979, 0.023045198985528325, 0.023317432974571548], "isController": false}, {"data": ["deleteBooks", 16, 0, 0.0, 392.25, 164, 836, 351.5, 685.5000000000001, 836.0, 836.0, 0.10347481358365615, 0.018694180188453504, 0.07134103358404419], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8817c000-95c5-4cb3-bb67-772c6d448ad5", 1, 0, 0.0, 346.0, 346, 346, 346.0, 346.0, 346.0, 346.0, 2.890173410404624, 0.5221504696531792, 1.9926390895953758], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2816da7f-ff81-4cef-9f71-6c3a33a4c554", 1, 0, 0.0, 206.0, 206, 206, 206.0, 206.0, 206.0, 206.0, 4.854368932038835, 1.5501744538834952, 2.896503337378641], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 4, 2.395209580838323, 161.35329341317367, 82, 1824, 94.0, 267.40000000000003, 355.4, 1157.5999999999933, 0.7040976798505795, 1.6390380133694236, 0.333891380811441], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 105.8888888888889, 86, 251, 88.0, 251.0, 251.0, 251.0, 0.04765485179341092, 0.036904587375170765, 0.016939810598439037], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6ba9bec9-4ae6-480f-9113-91243636a201", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 16, 100.0, 109.625, 83, 286, 86.0, 256.6, 286.0, 286.0, 0.10900147833254989, 0.05418139889772255, 0.0547136326786432], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ba9bec9-4ae6-480f-9113-91243636a201", 3, 0, 0.0, 731.0, 181, 1625, 387.0, 1625.0, 1625.0, 1625.0, 0.015406817002963246, 0.021239541018082467, 0.009880022622342966], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d409ba0e-6a40-4ba5-a6ec-9d4d88e4dae6", 2, 0, 0.0, 197.0, 176, 218, 197.0, 218.0, 218.0, 218.0, 0.058719906048150326, 0.03558173994421609, 0.036499238476218436], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cddb73cd-bb33-440f-aa64-157276b6683e", 3, 0, 0.0, 305.0, 161, 476, 278.0, 476.0, 476.0, 476.0, 0.047224758366653026, 0.021890643201208954, 0.03028410611403205], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd703512-4cfd-45a4-ae31-884be23e4f4b", 1, 0, 0.0, 349.0, 349, 349, 349.0, 349.0, 349.0, 349.0, 2.865329512893983, 0.5176620702005731, 1.9755103868194843], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 111.20000000000002, 84, 268, 89.0, 257.2, 268.0, 268.0, 0.09222256378727328, 0.07484077197971103, 0.0327822394712573], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e808a659-9a62-4922-bc6d-bd564a728746", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 537.5217391304349, 124, 1435, 465.0, 1145.0, 1379.7999999999993, 1435.0, 0.09982292281518003, 0.061317010205808826, 0.04513477857756675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c80a0a37-ad57-41b0-816a-a542ff27ffc3", 3, 0, 0.0, 393.0, 159, 762, 258.0, 762.0, 762.0, 762.0, 0.024019984627209837, 0.028390808652799127, 0.015403440662631308], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c01d745f-9e2e-4a3a-b59e-110b5941ab4a", 1, 0, 0.0, 329.0, 329, 329, 329.0, 329.0, 329.0, 329.0, 3.0395136778115504, 0.5491308890577508, 2.0956022036474162], "isController": false}, {"data": ["login", 23, 5, 21.73913043478261, 1991.826086956522, 1026, 3413, 1908.0, 3220.6, 3377.7999999999993, 3413.0, 0.10097950116126427, 0.15044024867299763, 0.1515850145871475], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 9, 100.0, 139.11111111111111, 83, 404, 86.0, 404.0, 404.0, 404.0, 0.046294629308615436, 0.02301168585750513, 0.023237733852176104], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 0, 0.0, 113.53846153846153, 86, 259, 88.0, 255.0, 259.0, 259.0, 0.07576110774395077, 0.06133394367161639, 0.026930706268357498], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e808a659-9a62-4922-bc6d-bd564a728746", 3, 0, 0.0, 320.6666666666667, 279, 382, 301.0, 382.0, 382.0, 382.0, 0.05070565368038536, 0.03213668870954112, 0.03251632088227838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 16, 100.0, 96.18750000000001, 82, 249, 86.5, 140.5000000000001, 249.0, 249.0, 0.07551016555603798, 0.03753386158986654, 0.03790256357012063], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd703512-4cfd-45a4-ae31-884be23e4f4b", 3, 0, 0.0, 520.0, 161, 758, 641.0, 758.0, 758.0, 758.0, 0.02508633881609205, 0.02515983394934232, 0.016087268055892362], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c80a0a37-ad57-41b0-816a-a542ff27ffc3", 1, 0, 0.0, 621.0, 621, 621, 621.0, 621.0, 621.0, 621.0, 1.6103059581320451, 0.29092441626409016, 1.1102304750402576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e4354f3-78be-4f5f-b3e5-d9b0217dc17b", 1, 0, 0.0, 528.0, 528, 528, 528.0, 528.0, 528.0, 528.0, 1.893939393939394, 0.3421667850378788, 1.305782433712121], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b685adc0-f14c-4c3a-b5e0-73c6656dca20", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 0.8101527466367713, 3.0917180493273544], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 122.4375, 85, 273, 88.5, 259.0, 273.0, 273.0, 0.11432899597704846, 0.09479034920362708, 0.04064038528871644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 16, 100.0, 98.0, 83, 254, 86.0, 153.9000000000001, 254.0, 254.0, 0.07866737467303872, 0.03910321651228194, 0.03948733455267764], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 100.1875, 85, 255, 89.5, 143.7000000000001, 255.0, 255.0, 0.0756304507102172, 0.058717000307248704, 0.02688426177589752], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=984da1f9-da7c-4e29-b392-e05030feae0f", 1, 0, 0.0, 836.0, 836, 836, 836.0, 836.0, 836.0, 836.0, 1.1961722488038278, 0.2161053379186603, 0.8247046949760766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cddb73cd-bb33-440f-aa64-157276b6683e", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 4.11522633744856, 0.7434735082304527, 2.837255658436214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 15, 100.0, 97.00000000000001, 81, 256, 86.0, 156.40000000000006, 256.0, 256.0, 0.09055182280819313, 0.04501062286071318, 0.04545277043301881], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 5, 100.0, 84.6, 83, 87, 85.0, 87.0, 87.0, 87.0, 0.08254230293025175, 0.0410293283120099, 0.04634943768056129], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/984da1f9-da7c-4e29-b392-e05030feae0f", 3, 0, 0.0, 353.0, 294, 442, 323.0, 442.0, 442.0, 442.0, 0.02183469678884393, 0.025807872408949318, 0.014002067927741712], "isController": false}, {"data": ["register", 25, 6, 24.0, 835.04, 139, 1980, 788.0, 1431.4, 1820.9999999999995, 1980.0, 0.101796090215767, 0.03214529661344767, 0.04592753289031675], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 3.2085561497326203, 0.9852216748768473], "isController": false}, {"data": ["401/Unauthorized", 4, 2.1390374331550803, 0.6568144499178982], "isController": false}, {"data": ["404/Not Found", 177, 94.6524064171123, 29.064039408866996], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 609, 187, "404/Not Found", 177, "406/Not Acceptable", 6, "401/Unauthorized", 4, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 13, "404/Not Found", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 21, "404/Not Found", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books", 59, 59, "404/Not Found", 59, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 7, "404/Not Found", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 9, "404/Not Found", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 5, "404/Not Found", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
