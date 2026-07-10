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

    var data = {"OkPercent": 96.9159599074788, "KoPercent": 3.0840400925212026};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7746386333771353, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3181818181818182, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/59420a04-f88e-40ed-a275-4dd7f8803b10"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.59375, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.65625, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/af571874-0c9d-4f6e-ac20-b50b72ea41dd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/42eb87fc-707e-45ab-85eb-14337eaa44f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d7649acf-5150-4039-9969-49d18409296d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4c61115c-7f86-4dbf-8e74-9f590a5565c3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9afcefa9-4d32-4706-a458-97e61407efe4"], "isController": false}, {"data": [0.74, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.02, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=37590d20-c81d-4908-8aeb-e9bc400488d9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d7142071-cefe-4b53-9c1e-c7e447564ec9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/255d575f-d6c8-4aaa-a225-20c0f27559b5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c1d851bf-fbea-4f5e-a1e2-b1ee5d445bce"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8180e44c-7233-4738-8731-4549d7751a25"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=349a93fe-5c7d-4e9f-b43d-26eaa5879ddc"], "isController": false}, {"data": [0.28846153846153844, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=42eb87fc-707e-45ab-85eb-14337eaa44f4"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b21e3c3f-ae7a-4795-addb-10d1dd4b4862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c1d851bf-fbea-4f5e-a1e2-b1ee5d445bce"], "isController": false}, {"data": [0.4818181818181818, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.28846153846153844, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3e8e235b-6d32-4ac5-8ef1-ba57660da13b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.32, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/afc2b001-a434-4915-bb3f-ca4b7ea92514"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c61115c-7f86-4dbf-8e74-9f590a5565c3"], "isController": false}, {"data": [0.3, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=af571874-0c9d-4f6e-ac20-b50b72ea41dd"], "isController": false}, {"data": [0.6727272727272727, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59420a04-f88e-40ed-a275-4dd7f8803b10"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8939393939393939, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d7649acf-5150-4039-9969-49d18409296d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/37590d20-c81d-4908-8aeb-e9bc400488d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8180e44c-7233-4738-8731-4549d7751a25"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/349a93fe-5c7d-4e9f-b43d-26eaa5879ddc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d7142071-cefe-4b53-9c1e-c7e447564ec9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9afcefa9-4d32-4706-a458-97e61407efe4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3e8e235b-6d32-4ac5-8ef1-ba57660da13b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e147a018-76a6-4dad-bbc0-1c031ed18a13"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/44c89190-4c4f-4666-9ab6-c9aa5185c569"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1297, 40, 3.0840400925212026, 328.18658442559763, 0, 3114, 100.0, 909.4000000000001, 1091.2999999999988, 1599.6799999999994, 5.029042039224201, 717.6356027737766, 3.6628988736516197], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 1, 1.8181818181818181, 1448.0363636363638, 1057, 1895, 1406.0, 1744.0, 1775.9999999999995, 1895.0, 0.24688365495540382, 297.09094429350876, 1.2112816993001971], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/59420a04-f88e-40ed-a275-4dd7f8803b10", 3, 0, 0.0, 478.6666666666667, 288, 614, 534.0, 614.0, 614.0, 614.0, 0.0322040448280304, 0.02684718711086779, 0.020651682392975223], "isController": false}, {"data": ["deleteBook", 16, 4, 25.0, 443.25000000000006, 89, 986, 468.5, 941.2, 986.0, 986.0, 0.08890074232119839, 0.018600570353824956, 0.059361213439569724], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, 25.0, 443.25000000000006, 89, 986, 468.5, 941.2, 986.0, 986.0, 0.08951299337044394, 0.01872867073204845, 0.059770028532266636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 122.2, 86, 264, 87.0, 262.2, 264.0, 264.0, 0.09820738781442731, 0.03611167489426338, 0.0554590417905171], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 112.86666666666666, 86, 285, 88.0, 270.6, 285.0, 285.0, 0.09831874938550782, 0.07306696121325337, 0.04935140350014748], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 162.2666666666667, 85, 694, 88.0, 434.20000000000016, 694.0, 694.0, 0.09820803079803846, 1.949800248957358, 0.05726883670950719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 156.0666666666667, 85, 944, 87.0, 533.0000000000002, 944.0, 944.0, 0.09831939382816392, 5.9225976987526545, 0.057237761693453244], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 285.6875, 86, 726, 206.0, 647.6000000000001, 726.0, 726.0, 0.08899221874287368, 0.12844775322457744, 0.057510352297945946], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/af571874-0c9d-4f6e-ac20-b50b72ea41dd", 3, 0, 0.0, 278.6666666666667, 174, 419, 243.0, 419.0, 419.0, 419.0, 0.05178127589063794, 0.03389718288283623, 0.0332060916355979], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 101.0, 88, 265, 89.0, 164.20000000000005, 265.0, 265.0, 0.09438711301283666, 0.07014511035426631, 0.04737790633652152], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/42eb87fc-707e-45ab-85eb-14337eaa44f4", 3, 0, 0.0, 326.6666666666667, 216, 422, 342.0, 422.0, 422.0, 422.0, 0.026376872757965814, 0.026454148752373917, 0.01691485655377365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 99.46666666666667, 87, 258, 88.0, 157.20000000000005, 258.0, 258.0, 0.09439245867183517, 0.04416043020936247, 0.05277620020011201], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 647.875, 512, 792, 687.0, 792.0, 792.0, 792.0, 0.09076881183625306, 26.689044488063903, 0.05176658800036308], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 873.875, 685, 1103, 857.5, 1103.0, 1103.0, 1103.0, 0.0905930447189917, 81.51578088373515, 0.05157787604606656], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 216.125, 86, 263, 257.0, 263.0, 263.0, 263.0, 0.09121798818727053, 0.16141308065950605, 0.05050839775603749], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 113.78571428571428, 87, 259, 88.0, 258.5, 259.0, 259.0, 0.09418729817007535, 0.06999661514397201, 0.04727760865177611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 137.1428571428571, 86, 264, 88.0, 262.5, 264.0, 264.0, 0.0942951438000943, 0.025231317774634606, 0.05377769919849128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 149.57142857142856, 86, 262, 90.0, 261.5, 262.0, 262.0, 0.09429577891681092, 0.025415659161171694, 0.055435604402265796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 124.35714285714286, 86, 262, 88.0, 261.0, 262.0, 262.0, 0.09429641404208314, 0.025415830347280222, 0.055528064128297014], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7649acf-5150-4039-9969-49d18409296d", 3, 0, 0.0, 1190.3333333333333, 351, 2831, 389.0, 2831.0, 2831.0, 2831.0, 0.07313149041977475, 0.03309009494905173, 0.04689747269757691], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 110.875, 87, 260, 88.5, 260.0, 260.0, 260.0, 0.09139305869719194, 0.06792003678570611, 0.05131934448328649], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 612.7058823529413, 87, 1041, 863.0, 1034.6, 1041.0, 1041.0, 0.10984253749184257, 58.15131324426396, 0.05902269621430925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 224.60000000000002, 86, 945, 88.0, 838.2, 945.0, 945.0, 0.09439245867183517, 11.346649520014347, 0.054410861268257074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 470.29411764705884, 86, 776, 681.0, 774.4, 776.0, 776.0, 0.109421162052741, 20.828526881400332, 0.05834999123021569], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 191.00000000000003, 86, 692, 89.0, 691.4, 692.0, 692.0, 0.09439305267132339, 3.7226751777735827, 0.054503384384242654], "isController": false}, {"data": ["deleteBooks", 16, 4, 25.0, 357.74999999999994, 90, 610, 420.0, 542.8000000000001, 610.0, 610.0, 0.08993109030205605, 0.018816148532437023, 0.06040049546410064], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4c61115c-7f86-4dbf-8e74-9f590a5565c3", 3, 0, 0.0, 1208.3333333333333, 427, 2719, 479.0, 2719.0, 2719.0, 2719.0, 0.020844044856384532, 0.024636955362477942, 0.013366786577824717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 276.64285714285717, 175, 524, 184.0, 521.5, 524.0, 524.0, 0.09413030323404827, 0.14588358518792444, 0.21170125815235663], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9afcefa9-4d32-4706-a458-97e61407efe4", 1, 0, 0.0, 335.0, 335, 335, 335.0, 335.0, 335.0, 335.0, 2.985074626865672, 0.5392957089552238, 2.058069029850746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 25, 0, 0.0, 559.56, 130, 1283, 516.0, 1168.0000000000002, 1266.5, 1283.0, 0.10661844669717375, 0.0654912138403538, 0.048207364082804155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 98.94117647058825, 86, 257, 89.0, 126.59999999999988, 257.0, 257.0, 0.10984324722484266, 0.08163155384580593, 0.05513616120465736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 150.23529411764707, 86, 266, 92.0, 264.4, 266.0, 266.0, 0.1098439569670145, 0.1264391779472103, 0.05721880754692599], "isController": false}, {"data": ["login", 25, 0, 0.0, 2821.84, 1406, 5703, 2551.0, 4585.800000000001, 5485.2, 5703.0, 0.10537940802063751, 40.48468567166727, 0.2149122466152134], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=37590d20-c81d-4908-8aeb-e9bc400488d9", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d7142071-cefe-4b53-9c1e-c7e447564ec9", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 94.6, 89, 111, 94.0, 105.0, 111.0, 111.0, 0.08696005055277606, 0.07040027530102672, 0.030911580469932115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 758.4705882352941, 176, 1130, 953.0, 1126.8, 1130.0, 1130.0, 0.10935781232912842, 78.91831529264472, 0.22893650934687654], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/255d575f-d6c8-4aaa-a225-20c0f27559b5", 1, 0, 0.0, 287.0, 287, 287, 287.0, 287.0, 287.0, 287.0, 3.484320557491289, 1.1126687717770036, 2.0790233013937285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1d851bf-fbea-4f5e-a1e2-b1ee5d445bce", 3, 0, 0.0, 389.6666666666667, 215, 634, 320.0, 634.0, 634.0, 634.0, 0.04428697962798937, 0.02847226066578093, 0.028400178993209332], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8180e44c-7233-4738-8731-4549d7751a25", 3, 0, 0.0, 391.33333333333337, 197, 755, 222.0, 755.0, 755.0, 755.0, 0.051371622315832734, 0.03302700327922189, 0.03294339061269221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 316.20000000000005, 174, 1206, 181.0, 810.6000000000003, 1206.0, 1206.0, 0.09815019597322462, 7.970089852414822, 0.21906791461914452], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, 50.0, 543.375, 86, 1205, 468.5, 1195.2, 1205.0, 1205.0, 0.12978690612350846, 77.65249454489411, 0.18932538185741288], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=349a93fe-5c7d-4e9f-b43d-26eaa5879ddc", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 0.44718827351485146, 1.7065671410891088], "isController": false}, {"data": ["register", 26, 8, 30.76923076923077, 906.1153846153845, 95, 1942, 864.5, 1639.3, 1841.1999999999996, 1942.0, 0.10888364944490278, 0.03412429277975769, 0.0491252402768995], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 106.78571428571429, 87, 264, 91.5, 188.5, 264.0, 264.0, 0.07868041700621013, 0.06108489406243853, 0.027968429482676256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 338.5333333333334, 177, 1034, 180.0, 927.2, 1034.0, 1034.0, 0.09433428296511519, 15.17425286265243, 0.20894183859089738], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=42eb87fc-707e-45ab-85eb-14337eaa44f4", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.4539298052763819, 1.7322942839195978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 273.82352941176464, 175, 1115, 180.0, 504.59999999999945, 1115.0, 1115.0, 0.09614514523572527, 6.906301077108407, 0.21478564757997012], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b21e3c3f-ae7a-4795-addb-10d1dd4b4862", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 1.4515269886363635, 2.712180397727273], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 90.0909090909091, 86, 97, 89.0, 96.4, 97.0, 97.0, 0.05427729778005852, 0.04033693711975052, 0.027244659237255935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 96.72727272727273, 85, 172, 89.0, 157.00000000000006, 172.0, 172.0, 0.05427729778005852, 0.01452341757005472, 0.030955021390189623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 92.63636363636364, 86, 136, 88.0, 127.60000000000002, 136.0, 136.0, 0.054277833426263564, 0.014629572290672601, 0.03190942941661198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 125.72727272727273, 86, 258, 88.0, 257.6, 258.0, 258.0, 0.05423207383450343, 0.014617238650706004, 0.031935488791216375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 91.25, 90, 95, 90.0, 95.0, 95.0, 95.0, 0.0442556204637989, 0.013051950566471942, 0.027357234134360062], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c1d851bf-fbea-4f5e-a1e2-b1ee5d445bce", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.3514865029182879, 1.3413484922178989], "isController": false}, {"data": ["https://demoqa.com/books", 55, 1, 1.8181818181818181, 984.9090909090911, 682, 1508, 951.0, 1372.8, 1379.2, 1508.0, 0.2584963035028599, 307.87835505436647, 0.5080654885697634], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 8, 30.76923076923077, 906.1153846153845, 95, 1942, 864.5, 1639.3, 1841.1999999999996, 1942.0, 0.10361414093914263, 0.03247282121379981, 0.04674778624402724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 113.42857142857143, 87, 259, 88.0, 259.0, 259.0, 259.0, 0.042261854450173275, 0.011390890457273267, 0.024886619368607896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 86.85714285714286, 85, 89, 87.0, 89.0, 89.0, 89.0, 0.04230578622281853, 0.011402731442869058, 0.02487117510364918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 136.49999999999997, 85, 262, 88.5, 261.0, 262.0, 262.0, 0.07775272412222728, 0.020956788923569072, 0.045710097579668776], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3e8e235b-6d32-4ac5-8ef1-ba57660da13b", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 124.14285714285711, 86, 258, 88.0, 258.0, 258.0, 258.0, 0.07775315594506184, 0.02095690531331745, 0.04578628226061748], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 88.57142857142858, 87, 94, 88.0, 92.0, 94.0, 94.0, 0.07775315594506184, 0.057783351244328186, 0.03902843960523612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 135.71428571428572, 85, 260, 88.0, 260.0, 260.0, 260.0, 0.04226159929966493, 0.011308279500105654, 0.024102318350590155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 111.71428571428571, 86, 262, 87.0, 260.5, 262.0, 262.0, 0.07775358777269294, 0.0208051592282401, 0.04434384302661394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 87.71428571428571, 87, 90, 87.0, 90.0, 90.0, 90.0, 0.04230578622281853, 0.031440139956606356, 0.02123552160012571], "isController": false}, {"data": ["deleteAccount", 16, 4, 25.0, 417.3125, 87, 755, 424.5, 743.8, 755.0, 755.0, 0.09039139473922082, 0.018294547421585466, 0.06150410574663292], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 145.57142857142858, 92, 264, 106.0, 264.0, 264.0, 264.0, 0.04052778758807557, 0.031899801558582914, 0.014406361994198737], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 25, 0, 0.0, 1478.5200000000002, 865, 3114, 1364.0, 1897.8000000000002, 2762.099999999999, 3114.0, 0.10749544219325101, 0.05563728941642874, 0.049443704368184786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 224.57142857142856, 175, 349, 176.0, 349.0, 349.0, 349.0, 0.042239412992843436, 0.06546284025355716, 0.0949974298071469], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/afc2b001-a434-4915-bb3f-ca4b7ea92514", 1, 0, 0.0, 325.0, 325, 325, 325.0, 325.0, 325.0, 325.0, 3.076923076923077, 0.9825721153846153, 1.8359375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c61115c-7f86-4dbf-8e74-9f590a5565c3", 1, 0, 0.0, 610.0, 610, 610, 610.0, 610.0, 610.0, 610.0, 1.639344262295082, 0.2961705942622951, 1.130251024590164], "isController": false}, {"data": ["addBook", 55, 14, 25.454545454545453, 941.3636363636361, 445, 2559, 759.0, 1590.4, 1760.3999999999999, 2559.0, 0.2746347358013842, 84.78615043554572, 0.9966090802357864], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 150.83636363636367, 86, 371, 90.0, 354.8, 356.4, 371.0, 0.25964461733104216, 0.1929585486219952, 0.1255118023231112], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=af571874-0c9d-4f6e-ac20-b50b72ea41dd", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 1, 1.8181818181818181, 538.2909090909093, 0, 785, 515.0, 692.0, 766.8, 785.0, 0.2595894710510542, 74.94902514566509, 0.12818151970756067], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59420a04-f88e-40ed-a275-4dd7f8803b10", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.3542432598039216, 1.3518688725490196], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 136.54545454545453, 86, 356, 91.0, 264.0, 268.4, 356.0, 0.2600067129005876, 0.46009000368736797, 0.12644857717235608], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 829.6181818181818, 591, 1149, 847.0, 1028.0, 1103.0, 1149.0, 0.258964893777309, 233.01706663255, 0.12998823769681334], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 98.05882352941177, 88, 168, 91.0, 126.39999999999996, 168.0, 168.0, 0.09214541630757056, 0.06883910495633933, 0.03275481595308172], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 14, 8.484848484848484, 164.13939393939395, 87, 1253, 93.0, 340.00000000000006, 497.7, 1130.2400000000007, 0.7133191822335969, 1.6415460328645601, 0.33939233581770156], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 107.90909090909089, 89, 262, 91.0, 229.80000000000013, 262.0, 262.0, 0.05355169442429494, 0.04147118523287685, 0.019035953877386092], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d7649acf-5150-4039-9969-49d18409296d", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 1.0036892361111112, 3.830295138888889], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 105.93333333333334, 87, 265, 92.0, 187.00000000000006, 265.0, 265.0, 0.09686293249299359, 0.07860653994304459, 0.034431745534618814], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/37590d20-c81d-4908-8aeb-e9bc400488d9", 3, 0, 0.0, 329.0, 183, 447, 357.0, 447.0, 447.0, 447.0, 0.037601995412556564, 0.030563861505583895, 0.02411325877693243], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8180e44c-7233-4738-8731-4549d7751a25", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/349a93fe-5c7d-4e9f-b43d-26eaa5879ddc", 3, 0, 0.0, 360.3333333333333, 196, 509, 376.0, 509.0, 509.0, 509.0, 0.01644799964910934, 0.022674895349602233, 0.01054770810831556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 218.9090909090909, 174, 348, 183.0, 347.6, 348.0, 348.0, 0.054208287954425616, 0.0840122587731186, 0.12191571011625214], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7142071-cefe-4b53-9c1e-c7e447564ec9", 3, 0, 0.0, 986.3333333333333, 418, 2033, 508.0, 2033.0, 2033.0, 2033.0, 0.0414181577203446, 0.026627884602109565, 0.026560472236028275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9afcefa9-4d32-4706-a458-97e61407efe4", 3, 0, 0.0, 384.0, 189, 739, 224.0, 739.0, 739.0, 739.0, 0.07787353338178797, 0.035235745898660575, 0.04993843123767002], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 251.07142857142856, 176, 356, 179.5, 353.0, 356.0, 356.0, 0.07771431109038729, 0.12044200361371547, 0.1747813070714472], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e8e235b-6d32-4ac5-8ef1-ba57660da13b", 3, 0, 0.0, 536.0, 250, 726, 632.0, 726.0, 726.0, 726.0, 0.048948424676532494, 0.03146912068234104, 0.031389452022385744], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 94.07142857142857, 89, 112, 90.5, 111.0, 112.0, 112.0, 0.08860591254596431, 0.07346330053859737, 0.031496632975323256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e147a018-76a6-4dad-bbc0-1c031ed18a13", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 251.0, 3.9840637450199203, 1.2722547310756973, 2.3772099103585655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 101.94117647058823, 89, 262, 91.0, 129.9999999999999, 262.0, 262.0, 0.11584879687617126, 0.08994120460601188, 0.041180627014576504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44c89190-4c4f-4666-9ab6-c9aa5185c569", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.6557206108829569, 1.2252149640657084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 88.8235294117647, 86, 92, 89.0, 91.2, 92.0, 92.0, 0.09619301978181159, 0.07148719536519396, 0.048284386882667146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 107.82352941176472, 85, 263, 87.0, 260.6, 263.0, 263.0, 0.0961962856916513, 0.03423898128133453, 0.054386709775806064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 173.05882352941177, 85, 1027, 87.0, 415.79999999999944, 1027.0, 1027.0, 0.09619737437754641, 5.116083396403916, 0.05606724267202354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 149.58823529411765, 85, 793, 88.0, 368.1999999999996, 793.0, 793.0, 0.09619519703039768, 1.6882013938401124, 0.05615991425895747], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 20.0, 0.6168080185042406], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 10.0, 0.3084040092521203], "isController": false}, {"data": ["Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, 2.5, 0.07710100231303008], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 10.0, 0.3084040092521203], "isController": false}, {"data": ["401/Unauthorized", 22, 55.0, 1.6962220508866614], "isController": false}, {"data": ["Assertion failed", 1, 2.5, 0.07710100231303008], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1297, 40, "401/Unauthorized", 22, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books", 55, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 1, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
