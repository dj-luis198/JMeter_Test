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

    var data = {"OkPercent": 99.60317460317461, "KoPercent": 0.3968253968253968};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7753772290809328, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c181c908-6007-4905-bd66-016a5bcd52cf"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fa72ab65-8dab-46fb-b0dc-7078e0015869"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9774ea12-e1c6-4094-865a-96401a5fc417"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8274ce26-ff05-4c25-81fd-e96a695b699d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c1e04db1-bbbf-432b-a906-ac4b0f4d9f91"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=08e87a4c-88d9-4168-bd6f-745af88e3bfb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d69c1322-7f47-465a-a598-9245038c745b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d4d7f40b-1e4f-4e9a-822a-a514c6b8676e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=68df1485-7650-4876-bb4f-764f033f6c60"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e8dac312-0c21-441e-a66e-5c08bec0d950"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e8dac312-0c21-441e-a66e-5c08bec0d950"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/006153f7-0ca2-420b-b041-002ea244fd90"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fcc73aed-9ee4-4618-bfda-ce7863d8ad8a"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bdd2314e-332a-4834-9975-c96f59c4f036"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b5ecf88b-6948-4aae-a89b-6b91ee64a054"], "isController": false}, {"data": [0.375, 500, 1500, "register"], "isController": true}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bdd2314e-332a-4834-9975-c96f59c4f036"], "isController": false}, {"data": [0.59375, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fa72ab65-8dab-46fb-b0dc-7078e0015869"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c1e04db1-bbbf-432b-a906-ac4b0f4d9f91"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d4d7f40b-1e4f-4e9a-822a-a514c6b8676e"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.35, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.30833333333333335, 500, 1500, "addBook"], "isController": true}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ec1b8606-3b1e-4d35-a721-1ecb9b709c61"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9683908045977011, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/68df1485-7650-4876-bb4f-764f033f6c60"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fcc73aed-9ee4-4618-bfda-ce7863d8ad8a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/08e87a4c-88d9-4168-bd6f-745af88e3bfb"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=006153f7-0ca2-420b-b041-002ea244fd90"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7a14d601-3183-4e87-9366-4c53b445f053"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9774ea12-e1c6-4094-865a-96401a5fc417"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c8e4d4be-164e-477e-8413-d71fbab778fd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b5ecf88b-6948-4aae-a89b-6b91ee64a054"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b475d2be-7371-4035-8133-effd9b986bf4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1260, 5, 0.3968253968253968, 407.6142857142853, 126, 2912, 152.0, 1050.0, 1241.9, 1763.5800000000022, 4.9064465255738785, 683.3598016673643, 3.578005137653083], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/c181c908-6007-4905-bd66-016a5bcd52cf", 1, 0, 0.0, 315.0, 315, 315, 315.0, 315.0, 315.0, 315.0, 3.1746031746031744, 1.013764880952381, 1.8942212301587302], "isController": false}, {"data": ["see books", 54, 0, 0.0, 1924.5925925925928, 1580, 2466, 1855.5, 2266.0, 2404.25, 2466.0, 0.241098336867954, 290.1226071548164, 1.185478638798973], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fa72ab65-8dab-46fb-b0dc-7078e0015869", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.3635091800804829, 1.3872296277665996], "isController": false}, {"data": ["deleteBook", 11, 0, 0.0, 725.3636363636364, 419, 1777, 584.0, 1641.4000000000005, 1777.0, 1777.0, 0.07691662238133863, 0.013896069473191061, 0.0522792667748161], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 0, 0.0, 725.3636363636364, 419, 1777, 584.0, 1641.4000000000005, 1777.0, 1777.0, 0.07651694850409366, 0.01382386276685286, 0.052007613436376166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 186.15, 128, 397, 133.5, 395.9, 396.95, 397.0, 0.12088609507691378, 0.04142473707274321, 0.06843522394149114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 162.14999999999998, 133, 399, 134.5, 372.90000000000055, 398.9, 399.0, 0.12086929194768777, 0.08982571403534219, 0.06067071880967922], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 212.45, 126, 918, 133.0, 397.0, 891.9499999999996, 918.0, 0.12088609507691378, 1.808179738734927, 0.0706664223760162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 238.25, 127, 1181, 133.5, 397.0, 1141.7999999999995, 1181.0, 0.12088974854932302, 5.469794799096349, 0.07055050169245648], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9774ea12-e1c6-4094-865a-96401a5fc417", 3, 0, 0.0, 476.0, 236, 875, 317.0, 875.0, 875.0, 875.0, 0.0468684091299661, 0.03907226425190208, 0.03005558788607852], "isController": false}, {"data": ["goToProfile", 11, 0, 0.0, 309.6363636363637, 229, 441, 297.0, 438.8, 441.0, 441.0, 0.0771210028534771, 0.19786905028990484, 0.049857523329103356], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8274ce26-ff05-4c25-81fd-e96a695b699d", 1, 0, 0.0, 334.0, 334, 334, 334.0, 334.0, 334.0, 334.0, 2.9940119760479043, 0.9560956212574849, 1.7864661302395208], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1e04db1-bbbf-432b-a906-ac4b0f4d9f91", 3, 0, 0.0, 615.6666666666666, 307, 791, 749.0, 791.0, 791.0, 791.0, 0.019545501928489525, 0.026945052300505576, 0.012534062109089961], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 134.26666666666665, 129, 153, 134.0, 142.20000000000002, 153.0, 153.0, 0.07027900766041184, 0.05222883284138028, 0.03527676751704266], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=08e87a4c-88d9-4168-bd6f-745af88e3bfb", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 150.46666666666667, 127, 396, 133.0, 245.4000000000001, 396.0, 396.0, 0.07027769058138392, 0.018804772675096868, 0.040080245409695514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d69c1322-7f47-465a-a598-9245038c745b", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 1.3884171195652173, 2.594259510869565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 2, 0, 0.0, 791.0, 656, 926, 791.0, 926.0, 926.0, 926.0, 0.054005886641643935, 15.879523836848216, 0.030800232225312557], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d4d7f40b-1e4f-4e9a-822a-a514c6b8676e", 1, 0, 0.0, 738.0, 738, 738, 738.0, 738.0, 738.0, 738.0, 1.3550135501355014, 0.2448022527100271, 0.9342183265582656], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 2, 0, 0.0, 1180.0, 1176, 1184, 1180.0, 1184.0, 1184.0, 1184.0, 0.0532467186709619, 47.91149105787918, 0.03031527049333085], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 2, 0, 0.0, 252.0, 126, 378, 252.0, 378.0, 378.0, 378.0, 0.05441436539246361, 0.09628792001088286, 0.03012982927492858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 131.78571428571428, 127, 135, 133.0, 134.5, 135.0, 135.0, 0.06486195985044685, 0.04820307758416998, 0.032557663440556335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 188.0, 126, 399, 133.0, 398.0, 399.0, 399.0, 0.06486316189381901, 0.03127331019880559, 0.03621405885868634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 280.07142857142856, 127, 1172, 133.0, 1042.0, 1172.0, 1172.0, 0.06486436398174532, 8.352852366970138, 0.03733682558435842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 296.78571428571433, 127, 886, 135.5, 884.0, 886.0, 886.0, 0.0648625608665638, 2.73952020816249, 0.037399130030902374], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 2, 0, 0.0, 131.5, 129, 134, 131.5, 134.0, 134.0, 134.0, 0.0547855147099107, 0.040714625677970746, 0.03076335054511587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 752.875, 127, 1192, 1024.0, 1189.9, 1192.0, 1192.0, 0.0776250612510249, 43.66232499490586, 0.041465730961240836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 149.53333333333333, 127, 396, 133.0, 240.00000000000009, 396.0, 396.0, 0.07027834911472705, 0.01894221128482878, 0.041315982585025085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 542.4374999999999, 130, 1011, 638.0, 957.1, 1011.0, 1011.0, 0.07762317828103472, 14.27271554379888, 0.04154052900195999], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 132.53333333333333, 128, 137, 133.0, 136.4, 137.0, 137.0, 0.0702780198465128, 0.018942122536755406, 0.04138441989008518], "isController": false}, {"data": ["deleteBooks", 11, 0, 0.0, 785.2727272727273, 221, 1881, 738.0, 1778.2000000000003, 1881.0, 1881.0, 0.07652493321460374, 0.013825305317091497, 0.052760354345224844], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=68df1485-7650-4876-bb4f-764f033f6c60", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e8dac312-0c21-441e-a66e-5c08bec0d950", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 0.8174844457013575, 3.1196973981900453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 471.0714285714286, 263, 1301, 276.5, 1173.0, 1301.0, 1301.0, 0.06482171712728671, 11.164582195094848, 0.1434162405024609], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e8dac312-0c21-441e-a66e-5c08bec0d950", 3, 0, 0.0, 364.6666666666667, 297, 456, 341.0, 456.0, 456.0, 456.0, 0.0718270404865085, 0.03179842938204803, 0.046060960207819565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 826.9, 136, 2348, 706.0, 1603.7000000000007, 2312.3499999999995, 2348.0, 0.08931242827095603, 0.05486085681878062, 0.0403824748920436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 133.12500000000003, 126, 148, 133.5, 141.70000000000002, 148.0, 148.0, 0.07762468464971861, 0.05768787599456627, 0.038963953037065784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 247.6875, 128, 399, 135.5, 399.0, 399.0, 399.0, 0.07762355486772461, 0.09363720327183284, 0.040195205047471656], "isController": false}, {"data": ["login", 20, 0, 0.0, 2738.399999999999, 1530, 4797, 2646.5, 4274.100000000001, 4774.549999999999, 4797.0, 0.09063923319208719, 10.972242088894427, 0.1517853096462804], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 138.86666666666667, 132, 157, 137.0, 154.0, 157.0, 157.0, 0.07046355624870816, 0.057045203252127995, 0.02504759226028298], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/006153f7-0ca2-420b-b041-002ea244fd90", 3, 0, 0.0, 658.3333333333333, 247, 1287, 441.0, 1287.0, 1287.0, 1287.0, 0.02667543992246339, 0.03152946691356268, 0.017106320523194295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fcc73aed-9ee4-4618-bfda-ce7863d8ad8a", 1, 0, 0.0, 753.0, 753, 753, 753.0, 753.0, 753.0, 753.0, 1.3280212483399734, 0.23992571381142097, 0.9156083997343958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 888.5, 263, 1328, 1156.0, 1327.3, 1328.0, 1328.0, 0.07757425310539433, 58.04869428289876, 0.16206125093331525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 466.79999999999995, 266, 1315, 416.5, 795.0, 1288.9999999999995, 1315.0, 0.12077148826704992, 7.402047954206471, 0.27007288181906014], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 2, 0, 0.0, 1312.5, 1306, 1319, 1312.5, 1319.0, 1319.0, 1319.0, 0.05306306545329124, 63.48187398848531, 0.11965099426918892], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bdd2314e-332a-4834-9975-c96f59c4f036", 3, 0, 0.0, 449.3333333333333, 248, 563, 537.0, 563.0, 563.0, 563.0, 0.022104495317531073, 0.02612676513605317, 0.014175083260265696], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b5ecf88b-6948-4aae-a89b-6b91ee64a054", 3, 0, 0.0, 348.0, 240, 442, 362.0, 442.0, 442.0, 442.0, 0.029474180617778827, 0.02457141164131887, 0.018901085877937592], "isController": false}, {"data": ["register", 20, 2, 10.0, 1084.15, 455, 1892, 1083.0, 1710.4000000000005, 1884.0, 1892.0, 0.09343305755009179, 0.029964273534619286, 0.042154367761857825], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 304.3333333333333, 260, 531, 268.0, 530.4, 531.0, 531.0, 0.070234912370241, 0.10885039641755125, 0.1579599640514307], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 136.28571428571428, 130, 147, 135.0, 144.0, 147.0, 147.0, 0.09986874393654055, 0.07753481584916966, 0.03550021757119215], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bdd2314e-332a-4834-9975-c96f59c4f036", 1, 0, 0.0, 902.0, 902, 902, 902.0, 902.0, 902.0, 902.0, 1.1086474501108647, 0.2002927522172949, 0.7643604490022172], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 585.125, 262, 1584, 527.0, 1210.9000000000003, 1584.0, 1584.0, 0.08542217239262166, 12.89016618950375, 0.18938445983823177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 154.6153846153846, 127, 397, 134.0, 301.79999999999995, 397.0, 397.0, 0.07766665471795056, 0.057719066640976924, 0.03898502004397127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 190.61538461538464, 126, 381, 133.0, 380.2, 381.0, 381.0, 0.07766155096091233, 0.029753148279796648, 0.04378963352708894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 213.9230769230769, 127, 914, 133.0, 706.3999999999999, 914.0, 914.0, 0.07766155096091233, 5.394706665227937, 0.04514311007628754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 233.92307692307693, 126, 916, 134.0, 707.5999999999998, 916.0, 916.0, 0.07766108701626104, 1.7758556347599077, 0.04521868129980764], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1242.9814814814815, 1005, 1884, 1061.5, 1721.0, 1857.0, 1884.0, 0.23815929328434898, 284.92131233488726, 0.47027157326265], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa72ab65-8dab-46fb-b0dc-7078e0015869", 3, 0, 0.0, 310.6666666666667, 248, 414, 270.0, 414.0, 414.0, 414.0, 0.05091995383257519, 0.032736623964627606, 0.03265374643560323], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 2, 10.0, 1084.15, 455, 1892, 1083.0, 1710.4000000000005, 1884.0, 1892.0, 0.09090743804658097, 0.029154299467282416, 0.04101487927492228], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 131.0, 126, 135, 132.5, 135.0, 135.0, 135.0, 0.03542665501523346, 0.009548590609574643, 0.0208615947013533], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 171.66666666666666, 126, 379, 131.0, 379.0, 379.0, 379.0, 0.03542665501523346, 0.009548590609574643, 0.020826998358564983], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c1e04db1-bbbf-432b-a906-ac4b0f4d9f91", 1, 0, 0.0, 805.0, 805, 805, 805.0, 805.0, 805.0, 805.0, 1.2422360248447206, 0.22442740683229812, 0.8564635093167702], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 225.42857142857142, 126, 1188, 133.0, 790.5, 1188.0, 1188.0, 0.09058557101261727, 5.844747098430928, 0.052698358136525396], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d4d7f40b-1e4f-4e9a-822a-a514c6b8676e", 3, 0, 0.0, 937.3333333333334, 430, 1928, 454.0, 1928.0, 1928.0, 1928.0, 0.018196485652071062, 0.021507630013889986, 0.011668970291204426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 247.07142857142858, 132, 923, 135.0, 663.5, 923.0, 923.0, 0.09058615714110088, 1.9251959532251905, 0.05278716216216216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 219.16666666666666, 126, 397, 133.0, 397.0, 397.0, 397.0, 0.03542560917287107, 0.009479118079459642, 0.02020366773140303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 152.64285714285717, 128, 396, 134.0, 269.5, 396.0, 396.0, 0.09058615714110088, 0.06732037654724392, 0.04547000465871665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 136.0, 132, 149, 134.0, 149.0, 149.0, 149.0, 0.03542498169709279, 0.02632657331199962, 0.017781680265923527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 205.3571428571429, 127, 397, 133.0, 396.0, 397.0, 397.0, 0.09058674327716955, 0.033957391069441206, 0.05111933266687372], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 197.0, 133, 491, 138.0, 491.0, 491.0, 491.0, 0.037698624628511465, 0.02967294086970727, 0.013400682973416185], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 597.0909090909091, 414, 1287, 456.0, 1204.6000000000004, 1287.0, 1287.0, 0.07807952754787695, 0.014106164644880112, 0.053145928418818586], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1384.2, 994, 2912, 1255.5, 1829.5, 2857.899999999999, 2912.0, 0.09081373648578084, 0.04700320345455454, 0.041770771371877714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 357.3333333333333, 264, 546, 269.5, 546.0, 546.0, 546.0, 0.035397185923719064, 0.054858724668888824, 0.07960910076398926], "isController": false}, {"data": ["addBook", 60, 3, 5.0, 1272.85, 682, 2877, 1100.0, 1867.3, 1913.35, 2877.0, 0.27386005751061204, 93.86377405546807, 0.9949312711100461], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 236.49999999999997, 127, 699, 134.5, 533.0, 540.0, 699.0, 0.23912321487877783, 0.17770777980737298, 0.11559178844237795], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 735.6111111111109, 624, 1051, 658.5, 924.5, 1007.5, 1051.0, 0.23901737302202058, 70.27904379218766, 0.12020893272103574], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 207.90740740740736, 126, 481, 135.0, 398.0, 400.75, 481.0, 0.23929487776019995, 0.4234397641616038, 0.11637582922322223], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ec1b8606-3b1e-4d35-a721-1ecb9b709c61", 1, 0, 0.0, 386.0, 386, 386, 386.0, 386.0, 386.0, 386.0, 2.5906735751295336, 0.8272951748704663, 1.545802299222798], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1002.7962962962962, 872, 1342, 921.5, 1239.5, 1318.25, 1342.0, 0.2387510666424968, 214.82862944452796, 0.11984184399828453], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 178.5, 133, 463, 136.0, 421.70000000000005, 463.0, 463.0, 0.08215407997699685, 0.06137487420156504, 0.0292032081168231], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 3, 1.7241379310344827, 210.9655172413793, 127, 967, 141.0, 341.0, 419.0, 951.25, 0.7206102823632705, 1.506634260773952, 0.3491467148557537], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 140.0, 133, 166, 136.0, 160.79999999999998, 166.0, 166.0, 0.08102970050176084, 0.06275053954872689, 0.0288035263502353], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/68df1485-7650-4876-bb4f-764f033f6c60", 3, 0, 0.0, 331.0, 239, 438, 316.0, 438.0, 438.0, 438.0, 0.016619301656944377, 0.02291104899647117, 0.010657559981829563], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 176.75, 129, 399, 136.5, 393.70000000000005, 398.8, 399.0, 0.12306404868413766, 0.09986935982081875, 0.04374542355568956], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fcc73aed-9ee4-4618-bfda-ce7863d8ad8a", 3, 0, 0.0, 303.3333333333333, 229, 429, 252.0, 429.0, 429.0, 429.0, 0.026637069922308545, 0.02671510821309656, 0.017081714761376248], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/08e87a4c-88d9-4168-bd6f-745af88e3bfb", 3, 0, 0.0, 385.6666666666667, 327, 461, 369.0, 461.0, 461.0, 461.0, 0.01998015304797235, 0.023615864491272003, 0.012812793458497892], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=006153f7-0ca2-420b-b041-002ea244fd90", 1, 0, 0.0, 1881.0, 1881, 1881, 1881.0, 1881.0, 1881.0, 1881.0, 0.531632110579479, 0.0960468168527379, 0.36653541998936734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a14d601-3183-4e87-9366-4c53b445f053", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.64252703722334, 1.2005627515090542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 410.38461538461536, 260, 1049, 275.0, 946.1999999999999, 1049.0, 1049.0, 0.07760174783013574, 7.252452289848498, 0.1730008316071919], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9774ea12-e1c6-4094-865a-96401a5fc417", 1, 0, 0.0, 1367.0, 1367, 1367, 1367.0, 1367.0, 1367.0, 1367.0, 0.731528895391368, 0.13216098207754207, 0.5043548829553768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 474.3571428571429, 261, 1332, 393.0, 1063.0, 1332.0, 1332.0, 0.09050651323657756, 7.864337958997317, 0.20189720237902833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 155.92857142857142, 134, 386, 137.0, 267.5, 386.0, 386.0, 0.06676904587033453, 0.055358320257728515, 0.02373430927422047], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8e4d4be-164e-477e-8413-d71fbab778fd", 1, 0, 0.0, 276.0, 276, 276, 276.0, 276.0, 276.0, 276.0, 3.6231884057971016, 1.1570142663043477, 2.1618829257246377], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 169.31249999999997, 132, 393, 137.0, 389.5, 393.0, 393.0, 0.07648805113226217, 0.05938281313491058, 0.027189111925921324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b5ecf88b-6948-4aae-a89b-6b91ee64a054", 1, 0, 0.0, 644.0, 644, 644, 644.0, 644.0, 644.0, 644.0, 1.5527950310559004, 0.28053425854037267, 1.0705793866459627], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b475d2be-7371-4035-8133-effd9b986bf4", 1, 0, 0.0, 317.0, 317, 317, 317.0, 317.0, 317.0, 317.0, 3.1545741324921135, 1.0073688880126184, 1.882270307570978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 164.56249999999997, 127, 402, 134.0, 385.20000000000005, 402.0, 402.0, 0.08566411102068788, 0.06366248875658542, 0.04299936822718122], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 278.6875, 126, 404, 385.5, 401.2, 404.0, 404.0, 0.0855459435182908, 0.03895097281777645, 0.0478898555877541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 398.6875, 132, 1181, 392.5, 967.5000000000002, 1181.0, 1181.0, 0.08548332807967046, 9.634916483456305, 0.04933656923348168], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 279.0, 126, 923, 133.0, 737.5000000000002, 923.0, 923.0, 0.0856677803478112, 3.1688503584661185, 0.04952668551357834], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 2, 40.0, 0.15873015873015872], "isController": false}, {"data": ["401/Unauthorized", 3, 60.0, 0.23809523809523808], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1260, 5, "401/Unauthorized", 3, "406/Not Acceptable", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 2, "406/Not Acceptable", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
