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

    var data = {"OkPercent": 66.61490683229813, "KoPercent": 33.38509316770186};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5096481271282634, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/35519c51-7b3a-407f-aec6-59860c0e7e36"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d99f9f94-6974-4f77-ad5b-5bef218b7e62"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8d6d2046-3eaf-4fd2-9631-1292c2e80a6a"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8f522dde-9af1-4ea9-9b48-70eb8ee7b3d7"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6111111111111112, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6111111111111112, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.38, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b89e85d7-fdf8-4bf4-99d8-dbb03aaea84f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fe4cf3f2-0406-4dd9-b319-aeee3a95bec4"], "isController": false}, {"data": [0.65625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d99f9f94-6974-4f77-ad5b-5bef218b7e62"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b89e85d7-fdf8-4bf4-99d8-dbb03aaea84f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fe4cf3f2-0406-4dd9-b319-aeee3a95bec4"], "isController": false}, {"data": [0.46, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/34548f70-e6cc-4cbd-bbf7-03d73b69a373"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9d379d0e-7163-4c37-941b-a976ba8de80b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/577ce207-138f-4d88-8d41-cdbee7c2ec61"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fe6a2425-4b2b-437e-a716-62ba45e71db9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9d379d0e-7163-4c37-941b-a976ba8de80b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=34548f70-e6cc-4cbd-bbf7-03d73b69a373"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b055a1a6-80d7-4749-90dd-0a6db8ab9f34"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8d6d2046-3eaf-4fd2-9631-1292c2e80a6a"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9277777777777778, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/21d965b6-1f4a-42da-bab6-fd2fcd391b43"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fe6a2425-4b2b-437e-a716-62ba45e71db9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f737fa8e-bc10-4309-b19f-84b39faa445c"], "isController": false}, {"data": [0.88, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=530051b5-8027-478b-b2bd-3bfa5938bc1e"], "isController": false}, {"data": [0.1, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/530051b5-8027-478b-b2bd-3bfa5938bc1e"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/08702827-3aaa-408b-a3bc-a771a099d891"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2c57ace4-de25-4816-b070-da151d862452"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/03b743ed-d4a2-4484-af6c-252355ca0442"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c57ace4-de25-4816-b070-da151d862452"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=03b743ed-d4a2-4484-af6c-252355ca0442"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8f522dde-9af1-4ea9-9b48-70eb8ee7b3d7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35519c51-7b3a-407f-aec6-59860c0e7e36"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c8f9e911-7180-4538-8f34-81bde49cfb5b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8f9e911-7180-4538-8f34-81bde49cfb5b"], "isController": false}, {"data": [0.38, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 644, 215, 33.38509316770186, 233.13354037267084, 82, 1698, 90.0, 588.5, 939.75, 1381.4999999999986, 2.55142467750626, 2.6622904124968305, 1.2279729458357105], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/35519c51-7b3a-407f-aec6-59860c0e7e36", 3, 0, 0.0, 338.6666666666667, 183, 454, 379.0, 454.0, 454.0, 454.0, 0.10927767457108513, 0.04944530197064073, 0.07007715459148363], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d99f9f94-6974-4f77-ad5b-5bef218b7e62", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.339594102443609, 1.2959645206766917], "isController": false}, {"data": ["see books", 58, 58, 100.0, 480.37931034482756, 334, 739, 510.5, 611.5, 620.15, 739.0, 0.2602180447754498, 1.6730812774799229, 0.4368308778994123], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 17, 100.0, 115.23529411764706, 83, 265, 86.0, 253.0, 265.0, 265.0, 0.10378447018027973, 0.05158817902515858, 0.05209493913346073], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 96.1111111111111, 84, 249, 87.0, 105.90000000000023, 249.0, 249.0, 0.10389010735311094, 0.08065687045480781, 0.03692968659817615], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8d6d2046-3eaf-4fd2-9631-1292c2e80a6a", 1, 0, 0.0, 646.0, 646, 646, 646.0, 646.0, 646.0, 646.0, 1.5479876160990713, 0.2796657314241486, 1.067264899380805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 18, 100.0, 112.55555555555557, 82, 258, 85.0, 249.9, 258.0, 258.0, 0.14615609470914936, 0.07264985567085647, 0.07336350847705349], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8f522dde-9af1-4ea9-9b48-70eb8ee7b3d7", 3, 0, 0.0, 310.3333333333333, 196, 449, 286.0, 449.0, 449.0, 449.0, 0.046434596870308174, 0.0387106128205922, 0.02977739447737861], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 87.66666666666667, 87, 89, 87.0, 89.0, 89.0, 89.0, 0.04239863193747615, 0.012504284028435349, 0.0262093105629125], "isController": false}, {"data": ["https://demoqa.com/books", 58, 58, 100.0, 165.3965517241379, 83, 475, 86.0, 344.0, 354.15, 475.0, 0.2678921964850696, 0.13316125782314497, 0.12949866919932565], "isController": false}, {"data": ["deleteBook", 18, 3, 16.666666666666668, 448.1111111111111, 87, 755, 472.5, 714.5000000000001, 755.0, 755.0, 0.08784387215788472, 0.01754303892215569, 0.059005804100844765], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 3, 16.666666666666668, 448.1111111111111, 87, 755, 472.5, 714.5000000000001, 755.0, 755.0, 0.08685875319085282, 0.01734630373782168, 0.05834408763324374], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, 28.0, 795.8, 112, 1447, 756.0, 1308.6000000000001, 1422.3999999999999, 1447.0, 0.10876564049910377, 0.034193198231905746, 0.049071997959556586], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b89e85d7-fdf8-4bf4-99d8-dbb03aaea84f", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 0.72265625, 2.7578125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe4cf3f2-0406-4dd9-b319-aeee3a95bec4", 3, 0, 0.0, 294.3333333333333, 223, 411, 249.0, 411.0, 411.0, 411.0, 0.027143671453000732, 0.027223193927960698, 0.01740658618568081], "isController": false}, {"data": ["deleteAccount", 16, 3, 18.75, 489.0625, 84, 1498, 403.5, 1337.0000000000002, 1498.0, 1498.0, 0.07809296968040452, 0.018741550096640053, 0.0519110432610648], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 114.16666666666666, 85, 253, 86.5, 253.0, 253.0, 253.0, 0.038985341511591644, 0.030685727791350453, 0.013858070615448592], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d99f9f94-6974-4f77-ad5b-5bef218b7e62", 3, 0, 0.0, 411.0, 167, 556, 510.0, 556.0, 556.0, 556.0, 0.02390838307605257, 0.02839898757959499, 0.015331873261661313], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b89e85d7-fdf8-4bf4-99d8-dbb03aaea84f", 3, 0, 0.0, 701.3333333333334, 200, 1284, 620.0, 1284.0, 1284.0, 1284.0, 0.07313862206836023, 0.03309332183431664, 0.04690204605295236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fe4cf3f2-0406-4dd9-b319-aeee3a95bec4", 1, 0, 0.0, 567.0, 567, 567, 567.0, 567.0, 567.0, 567.0, 1.763668430335097, 0.3186315035273369, 1.2159667107583776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 25, 0, 0.0, 1063.0, 704, 1698, 1000.0, 1492.2, 1642.1999999999998, 1698.0, 0.10652486077200697, 0.055134937704261415, 0.0489972748277493], "isController": false}, {"data": ["goToProfile", 18, 3, 16.666666666666668, 280.05555555555554, 83, 1161, 180.0, 801.0000000000006, 1161.0, 1161.0, 0.08813419900702135, 0.1418075054227014, 0.0557293885322718], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/34548f70-e6cc-4cbd-bbf7-03d73b69a373", 3, 0, 0.0, 664.3333333333333, 241, 1498, 254.0, 1498.0, 1498.0, 1498.0, 0.05930611841454977, 0.026834474152416726, 0.03803159286349708], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 6, 100.0, 114.66666666666667, 86, 246, 89.0, 246.0, 246.0, 246.0, 0.03867300044473951, 0.019223200416379305, 0.019412033426363384], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9d379d0e-7163-4c37-941b-a976ba8de80b", 1, 0, 0.0, 1090.0, 1090, 1090, 1090.0, 1090.0, 1090.0, 1090.0, 0.9174311926605505, 0.16574684633027523, 0.6325258027522935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/577ce207-138f-4d88-8d41-cdbee7c2ec61", 2, 0, 0.0, 175.0, 172, 178, 175.0, 178.0, 178.0, 178.0, 0.01804712103301721, 0.025695998502088955, 0.011217766149917435], "isController": false}, {"data": ["addBook", 61, 61, 100.0, 527.2786885245902, 347, 1190, 492.0, 675.6, 722.3, 1190.0, 0.2895578783477163, 1.0160994996226254, 0.5644301880702154], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fe6a2425-4b2b-437e-a716-62ba45e71db9", 3, 0, 0.0, 486.0, 178, 761, 519.0, 761.0, 761.0, 761.0, 0.038328861632809505, 0.0246417648843746, 0.02457938066947745], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9d379d0e-7163-4c37-941b-a976ba8de80b", 3, 0, 0.0, 243.66666666666669, 172, 385, 174.0, 385.0, 385.0, 385.0, 0.10431517090302167, 0.04835442817900483, 0.06689481988247158], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=34548f70-e6cc-4cbd-bbf7-03d73b69a373", 1, 0, 0.0, 169.0, 169, 169, 169.0, 169.0, 169.0, 169.0, 5.9171597633136095, 1.069018121301775, 4.0796042899408285], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 107.05555555555556, 85, 263, 87.5, 250.40000000000003, 263.0, 263.0, 0.1388256889224813, 0.10371255080634588, 0.04934819410916327], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b055a1a6-80d7-4749-90dd-0a6db8ab9f34", 1, 0, 0.0, 339.0, 339, 339, 339.0, 339.0, 339.0, 339.0, 2.949852507374631, 0.9419939159292035, 1.7601170722713864], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8d6d2046-3eaf-4fd2-9631-1292c2e80a6a", 3, 0, 0.0, 371.6666666666667, 321, 445, 349.0, 445.0, 445.0, 445.0, 0.02162099831356213, 0.029806291620421754, 0.0138650282154028], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 395.4375, 87, 1090, 358.0, 789.7000000000003, 1090.0, 1090.0, 0.0790189793711077, 0.015968740276961522, 0.05342365933189453], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 12, 6.666666666666667, 137.38888888888889, 83, 799, 90.0, 250.60000000000002, 261.6499999999999, 780.3699999999999, 0.7713040609158808, 1.7368820060118866, 0.3693739662383072], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 17, 0, 0.0, 108.3529411764706, 85, 265, 87.0, 256.2, 265.0, 265.0, 0.08244143021332932, 0.0638438028898146, 0.02930535214614441], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/21d965b6-1f4a-42da-bab6-fd2fcd391b43", 2, 0, 0.0, 171.5, 169, 174, 171.5, 174.0, 174.0, 174.0, 0.035641729336707416, 0.030716627089496382, 0.022154258518373313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 10, 100.0, 117.3, 83, 254, 84.5, 253.0, 254.0, 254.0, 0.04868833622217462, 0.024201526501061405, 0.024439262517771242], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 105.89473684210525, 85, 257, 88.0, 254.0, 257.0, 257.0, 0.08514757419042583, 0.06909925210180065, 0.03026730176300293], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fe6a2425-4b2b-437e-a716-62ba45e71db9", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f737fa8e-bc10-4309-b19f-84b39faa445c", 1, 0, 0.0, 379.0, 379, 379, 379.0, 379.0, 379.0, 379.0, 2.638522427440633, 0.8425750329815304, 1.5743527374670185], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 25, 0, 0.0, 396.8, 93, 1069, 407.0, 694.6000000000001, 963.6999999999998, 1069.0, 0.10590976488032197, 0.06505590049777589, 0.04788693470662995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=530051b5-8027-478b-b2bd-3bfa5938bc1e", 1, 0, 0.0, 344.0, 344, 344, 344.0, 344.0, 344.0, 344.0, 2.9069767441860463, 0.5251862281976745, 2.0042242005813957], "isController": false}, {"data": ["login", 25, 7, 28.0, 1718.3200000000002, 1233, 2415, 1634.0, 2263.6000000000004, 2385.6, 2415.0, 0.1086895088538474, 0.16313615969532155, 0.16291962981440178], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/530051b5-8027-478b-b2bd-3bfa5938bc1e", 3, 0, 0.0, 288.3333333333333, 182, 439, 244.0, 439.0, 439.0, 439.0, 0.06067224851352991, 0.03971741268252235, 0.03890765936577276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 17, 17, 100.0, 105.17647058823529, 83, 250, 85.0, 247.6, 250.0, 250.0, 0.08510212254705647, 0.04230173864887866, 0.042717276356627955], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 108.52941176470587, 85, 256, 88.0, 253.6, 256.0, 256.0, 0.10705222259305672, 0.08666630129848049, 0.038053719749875634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 18, 100.0, 131.72222222222226, 83, 252, 88.0, 252.0, 252.0, 252.0, 0.10239839803395076, 0.05089920371023529, 0.05139919588813544], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/08702827-3aaa-408b-a3bc-a771a099d891", 1, 0, 0.0, 182.0, 182, 182, 182.0, 182.0, 182.0, 182.0, 5.4945054945054945, 1.7545930631868132, 3.2784598214285716], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 104.2, 84, 253, 88.0, 236.80000000000007, 253.0, 253.0, 0.04892487585312752, 0.04056369101494655, 0.017391264463416423], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 14, 100.0, 87.07142857142857, 84, 106, 86.0, 97.5, 106.0, 106.0, 0.06675917581028949, 0.03318400438226304, 0.03350997692039922], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c57ace4-de25-4816-b070-da151d862452", 3, 0, 0.0, 535.6666666666667, 164, 1268, 175.0, 1268.0, 1268.0, 1268.0, 0.03811992528494644, 0.03140674833860659, 0.024445394795359534], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/03b743ed-d4a2-4484-af6c-252355ca0442", 3, 0, 0.0, 597.6666666666666, 288, 1161, 344.0, 1161.0, 1161.0, 1161.0, 0.03912210007433199, 0.03261448512056127, 0.025088065477354822], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 102.00000000000001, 85, 258, 90.0, 178.0, 258.0, 258.0, 0.06276985432910234, 0.04873245526526988, 0.0223127216560481], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c57ace4-de25-4816-b070-da151d862452", 1, 0, 0.0, 526.0, 526, 526, 526.0, 526.0, 526.0, 526.0, 1.9011406844106464, 0.34346779942965777, 1.3107473859315588], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=03b743ed-d4a2-4484-af6c-252355ca0442", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 0.4856560819892473, 1.8533686155913978], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8f522dde-9af1-4ea9-9b48-70eb8ee7b3d7", 1, 0, 0.0, 340.0, 340, 340, 340.0, 340.0, 340.0, 340.0, 2.941176470588235, 0.5313648897058824, 2.0278033088235294], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35519c51-7b3a-407f-aec6-59860c0e7e36", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 1.050372456395349, 4.008448401162791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 19, 100.0, 103.57894736842103, 83, 252, 85.0, 251.0, 252.0, 252.0, 0.08808571203389909, 0.04378479240747523, 0.04421489842326575], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 13, 100.0, 98.30769230769232, 83, 250, 86.0, 185.59999999999994, 250.0, 250.0, 0.05903616646382446, 0.02934512571297524, 0.033615845988265426], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8f9e911-7180-4538-8f34-81bde49cfb5b", 3, 0, 0.0, 243.0, 157, 396, 176.0, 396.0, 396.0, 396.0, 0.027855153203342618, 0.02322169510213556, 0.017862842386258123], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8f9e911-7180-4538-8f34-81bde49cfb5b", 1, 0, 0.0, 661.0, 661, 661, 661.0, 661.0, 661.0, 661.0, 1.5128593040847202, 0.27331930786686837, 1.0430455748865355], "isController": false}, {"data": ["register", 25, 7, 28.0, 795.8, 112, 1447, 756.0, 1308.6000000000001, 1422.3999999999999, 1447.0, 0.10656345640702125, 0.0335008866079573, 0.04807843443363654], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 3.255813953488372, 1.0869565217391304], "isController": false}, {"data": ["401/Unauthorized", 18, 8.372093023255815, 2.7950310559006213], "isController": false}, {"data": ["404/Not Found", 190, 88.37209302325581, 29.503105590062113], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 644, 215, "404/Not Found", 190, "401/Unauthorized", 18, "406/Not Acceptable", 7, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 58, 58, "404/Not Found", 58, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 6, "404/Not Found", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 10, "404/Not Found", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 13, "404/Not Found", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
