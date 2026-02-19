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

    var data = {"OkPercent": 66.89075630252101, "KoPercent": 33.109243697478995};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5124069478908189, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9cf0189b-3ed9-4f57-ae9d-3a295df1c6b3"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a63d0abc-c587-45ed-b5aa-5c8ad35a4f66"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5fccf2c3-a778-4b20-9812-2768c177d312"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/60193b02-0d71-417b-96ef-69d1246fa139"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3ec417d2-62ed-47e0-a5f9-9826b477aa19"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8c7b31ab-4412-49dd-907a-9ecfe3f0225c"], "isController": false}, {"data": [0.391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5fccf2c3-a778-4b20-9812-2768c177d312"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8c7b31ab-4412-49dd-907a-9ecfe3f0225c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0e86024d-556c-4821-8724-9866188a8847"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60193b02-0d71-417b-96ef-69d1246fa139"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3ec417d2-62ed-47e0-a5f9-9826b477aa19"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ac2961bc-9ad3-454e-bb53-fea1c46b7610"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/163ef3f4-9292-4d64-b87e-252e98adcf38"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6d3b04cc-37d3-404f-baf7-420d150df217"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ac2961bc-9ad3-454e-bb53-fea1c46b7610"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9327485380116959, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0e86024d-556c-4821-8724-9866188a8847"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8bbac796-963e-402d-b8a5-6cc0d1332bcf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a8bf00ff-13a3-43dc-8d51-9a65e919d928"], "isController": false}, {"data": [0.8809523809523809, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f4afd6b-2ff7-49a7-ad63-0c8fb6985459"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4db45d18-7365-49c1-9d59-569c9db9479b"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8bbac796-963e-402d-b8a5-6cc0d1332bcf"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f0cb709c-b796-4f45-8757-9fbc9699de88"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8b3f5ddb-3966-40d4-91ff-36764dad295d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0f4afd6b-2ff7-49a7-ad63-0c8fb6985459"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f0cb709c-b796-4f45-8757-9fbc9699de88"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9db23b73-20c3-473e-9a19-14b1fe347c9d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9db23b73-20c3-473e-9a19-14b1fe347c9d"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9cf0189b-3ed9-4f57-ae9d-3a295df1c6b3"], "isController": false}, {"data": [0.391304347826087, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 595, 197, 33.109243697478995, 300.7478991596639, 139, 1470, 153.0, 617.1999999999999, 1002.3999999999992, 1330.04, 2.3504315708388472, 2.4606311970412214, 1.1220525476999348], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/9cf0189b-3ed9-4f57-ae9d-3a295df1c6b3", 3, 0, 0.0, 787.3333333333334, 425, 1470, 467.0, 1470.0, 1470.0, 1470.0, 0.04998583734608528, 0.03213607706983021, 0.032054719912691404], "isController": false}, {"data": ["see books", 57, 57, 100.0, 808.8070175438593, 568, 1063, 875.0, 1038.0, 1057.2, 1063.0, 0.24642148449490084, 1.585025308188975, 0.41367044125657665], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 221.5, 143, 452, 150.5, 447.5, 451.8, 452.0, 0.09875324034069868, 0.07666877545981977, 0.03510369090235773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 15, 100.0, 206.26666666666665, 140, 442, 150.0, 441.4, 442.0, 442.0, 0.08865667407442432, 0.044068600687384746, 0.04450149460376377], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 19, 100.0, 191.1052631578947, 140, 438, 147.0, 430.0, 438.0, 438.0, 0.09482268158543523, 0.04713353996776029, 0.047596541342689175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a63d0abc-c587-45ed-b5aa-5c8ad35a4f66", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 1.33056640625, 2.4861653645833335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5fccf2c3-a778-4b20-9812-2768c177d312", 3, 0, 0.0, 415.66666666666663, 230, 755, 262.0, 755.0, 755.0, 755.0, 0.028331822302810516, 0.023619074517414625, 0.01816851885954971], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60193b02-0d71-417b-96ef-69d1246fa139", 3, 0, 0.0, 451.33333333333337, 218, 908, 228.0, 908.0, 908.0, 908.0, 0.06271558482282846, 0.028377168913975123, 0.04021800198599352], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 152.5, 152, 153, 152.5, 153.0, 153.0, 153.0, 0.020673544065659178, 0.006097080378739327, 0.012779641985900642], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3ec417d2-62ed-47e0-a5f9-9826b477aa19", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.44608410493827155, 1.7023533950617282], "isController": false}, {"data": ["https://demoqa.com/books", 57, 57, 100.0, 253.421052631579, 139, 603, 149.0, 582.4, 599.1, 603.0, 0.2575281812636953, 0.12800961353830168, 0.12448872043508707], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 454.8461538461538, 146, 909, 446.0, 798.5999999999999, 909.0, 909.0, 0.07739477287610882, 0.015342909076025481, 0.052034496487468], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 454.8461538461538, 146, 909, 446.0, 798.5999999999999, 909.0, 909.0, 0.07521058965102287, 0.014909911815583633, 0.050566013925529944], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c7b31ab-4412-49dd-907a-9ecfe3f0225c", 3, 0, 0.0, 329.0, 242, 456, 289.0, 456.0, 456.0, 456.0, 0.03009359106822217, 0.025087788647694332, 0.01929829895976487], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 917.7826086956521, 269, 1452, 943.0, 1215.0, 1406.5999999999995, 1452.0, 0.09135902508003844, 0.028922082668001305, 0.04121862264353297], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5fccf2c3-a778-4b20-9812-2768c177d312", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 203.66666666666669, 142, 473, 151.0, 473.0, 473.0, 473.0, 0.03109372165936828, 0.02447415982172933, 0.011052846371103568], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 571.7692307692307, 142, 1469, 464.0, 1244.6, 1469.0, 1469.0, 0.07509112018622598, 0.01722154371458443, 0.05013031738994819], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8c7b31ab-4412-49dd-907a-9ecfe3f0225c", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1067.3809523809523, 763, 1343, 1042.0, 1328.2, 1341.8, 1343.0, 0.08985648635465071, 0.046507751726528206, 0.0413304737041411], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 317.2142857142858, 139, 1470, 237.0, 896.0, 1470.0, 1470.0, 0.07463681194188991, 0.1329936775289884, 0.0468927012528322], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 6, 100.0, 193.83333333333331, 145, 421, 150.0, 421.0, 421.0, 421.0, 0.031780334329117144, 0.015797060716328738, 0.015952238130045128], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0e86024d-556c-4821-8724-9866188a8847", 1, 0, 0.0, 1330.0, 1330, 1330, 1330.0, 1330.0, 1330.0, 1330.0, 0.7518796992481204, 0.1358376409774436, 0.5183858082706767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60193b02-0d71-417b-96ef-69d1246fa139", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 0.7958769273127753, 3.037238436123348], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ec417d2-62ed-47e0-a5f9-9826b477aa19", 3, 0, 0.0, 290.0, 219, 419, 232.0, 419.0, 419.0, 419.0, 0.05179110919292188, 0.032824638541217095, 0.03321239749676306], "isController": false}, {"data": ["addBook", 57, 57, 100.0, 867.1403508771931, 568, 1551, 817.0, 1047.8, 1379.6999999999994, 1551.0, 0.2693023651362103, 0.8726996720535014, 0.5263179944178817], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ac2961bc-9ad3-454e-bb53-fea1c46b7610", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/163ef3f4-9292-4d64-b87e-252e98adcf38", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 1.2096058238636362, 2.260150331439394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d3b04cc-37d3-404f-baf7-420d150df217", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 1.2981135670731707, 2.42552718495935], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 182.31578947368422, 143, 464, 149.0, 437.0, 464.0, 464.0, 0.09745388892308324, 0.07280490725210809, 0.03464181207812724], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac2961bc-9ad3-454e-bb53-fea1c46b7610", 3, 0, 0.0, 492.0, 235, 725, 516.0, 725.0, 725.0, 725.0, 0.01806445397177128, 0.02490330812840214, 0.011584301537887181], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 504.0769230769231, 152, 1330, 427.0, 1275.2, 1330.0, 1330.0, 0.07532127420420176, 0.01493185416352828, 0.05110439818301911], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 8, 4.678362573099415, 221.04678362573108, 140, 1106, 154.0, 383.2000000000001, 460.0, 1038.3200000000002, 0.7233777935708212, 1.592448230632723, 0.3459782005765871], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 145.4, 143, 148, 145.0, 148.0, 148.0, 148.0, 0.02801968102395122, 0.021698835011712228, 0.00996012098898266], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e86024d-556c-4821-8724-9866188a8847", 3, 0, 0.0, 673.3333333333333, 229, 1469, 322.0, 1469.0, 1469.0, 1469.0, 0.05126452494873548, 0.03295814999145591, 0.03287471163704716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 16, 100.0, 164.8125, 141, 454, 147.0, 241.20000000000022, 454.0, 454.0, 0.08869867949840897, 0.04408948033661149, 0.04452257935759982], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 227.75, 141, 500, 154.0, 462.90000000000003, 500.0, 500.0, 0.10595956318170079, 0.08598866894921225, 0.0376653134747452], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8bbac796-963e-402d-b8a5-6cc0d1332bcf", 1, 0, 0.0, 1193.0, 1193, 1193, 1193.0, 1193.0, 1193.0, 1193.0, 0.8382229673093042, 0.1514367665549036, 0.5779154442581727], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a8bf00ff-13a3-43dc-8d51-9a65e919d928", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 1.2096058238636362, 2.260150331439394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 449.2380952380953, 174, 1030, 364.0, 869.4000000000001, 1016.3999999999999, 1030.0, 0.09210122363054252, 0.05657389615587036, 0.04164342435638788], "isController": false}, {"data": ["login", 21, 4, 19.047619047619047, 1807.9523809523812, 1273, 2545, 1848.0, 2244.6, 2517.4999999999995, 2545.0, 0.08944543828264759, 0.13282880515802029, 0.13435533398287758], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f4afd6b-2ff7-49a7-ad63-0c8fb6985459", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.3514865029182879, 1.3413484922178989], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4db45d18-7365-49c1-9d59-569c9db9479b", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 283.0, 3.5335689045936394, 1.1283955388692581, 2.1084087897526502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 5, 100.0, 143.4, 141, 147, 142.0, 147.0, 147.0, 147.0, 0.02781873313489304, 0.013827866372715386, 0.013963700030600606], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 207.53333333333333, 142, 447, 150.0, 443.4, 447.0, 447.0, 0.08517113720502395, 0.06895202416305161, 0.030275677678348357], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8bbac796-963e-402d-b8a5-6cc0d1332bcf", 3, 0, 0.0, 337.3333333333333, 239, 524, 249.0, 524.0, 524.0, 524.0, 0.017339737476374607, 0.023904227933739083, 0.011119558212388664], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0cb709c-b796-4f45-8757-9fbc9699de88", 3, 0, 0.0, 531.3333333333334, 242, 888, 464.0, 888.0, 888.0, 888.0, 0.03224904865306474, 0.026884704948079034, 0.0206805422677531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 20, 100.0, 203.0, 140, 446, 148.0, 436.00000000000006, 445.6, 446.0, 0.10027223912923589, 0.049842353239044006, 0.05033196378166723], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8b3f5ddb-3966-40d4-91ff-36764dad295d", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.7461120035046729, 1.3941114193925235], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 189.68750000000003, 142, 447, 150.5, 444.9, 447.0, 447.0, 0.08851564790688153, 0.07338846198529535, 0.0314645467168993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 17, 100.0, 165.41176470588235, 142, 439, 149.0, 222.19999999999982, 439.0, 439.0, 0.0749734285348869, 0.037267065551032645, 0.037633146745050645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f4afd6b-2ff7-49a7-ad63-0c8fb6985459", 3, 0, 0.0, 377.0, 220, 589, 322.0, 589.0, 589.0, 589.0, 0.05444349672431628, 0.03500192253597808, 0.03491331007386168], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f0cb709c-b796-4f45-8757-9fbc9699de88", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 170.6470588235294, 142, 448, 152.0, 229.5999999999998, 448.0, 448.0, 0.07629956105311347, 0.059236475622290244, 0.027122109593098926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9db23b73-20c3-473e-9a19-14b1fe347c9d", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9db23b73-20c3-473e-9a19-14b1fe347c9d", 3, 0, 0.0, 303.0, 240, 409, 260.0, 409.0, 409.0, 409.0, 0.01911229748928119, 0.02634784500882351, 0.01225625848108201], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 16, 100.0, 164.6875, 139, 425, 149.0, 233.9000000000002, 425.0, 425.0, 0.11119991660006255, 0.05527417729436703, 0.055817145637140776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 9, 100.0, 145.0, 139, 154, 142.0, 154.0, 154.0, 154.0, 0.059165762745291395, 0.02940954417710285, 0.033672355208230614], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9cf0189b-3ed9-4f57-ae9d-3a295df1c6b3", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 917.7826086956521, 269, 1452, 943.0, 1215.0, 1406.5999999999995, 1452.0, 0.0915626965612236, 0.028986560188539536, 0.04131051348758331], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 2.5380710659898478, 0.8403361344537815], "isController": false}, {"data": ["401/Unauthorized", 12, 6.091370558375634, 2.0168067226890756], "isController": false}, {"data": ["404/Not Found", 180, 91.37055837563452, 30.252100840336134], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 595, 197, "404/Not Found", 180, "401/Unauthorized", 12, "406/Not Acceptable", 5, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books", 57, 57, "404/Not Found", 57, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 6, "404/Not Found", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 5, "404/Not Found", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 20, "404/Not Found", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 9, "404/Not Found", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
