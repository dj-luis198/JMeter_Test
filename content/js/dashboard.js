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

    var data = {"OkPercent": 99.05660377358491, "KoPercent": 0.9433962264150944};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7326832548755884, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/640de5fd-8eb1-4074-b320-deab6e4f267e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7a18202f-b984-4dbc-97bf-235df5f0eec8"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5dbe27c7-1f81-4c41-b088-34ece1d4f59c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8975c3bb-07a7-40c1-9fcb-db521f736c3f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a908d628-dc30-4304-a074-8932e3efca33"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d75f35c6-b5d8-4366-b694-cf56acc2b3bc"], "isController": false}, {"data": [0.9, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9d6e7bb1-ae49-4fbf-a34f-13e89ce4d5aa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7c827983-569b-4fd8-b1b7-30c6a1267378"], "isController": false}, {"data": [0.65, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.65, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bccf502a-0608-48da-ae94-c891986b828b"], "isController": false}, {"data": [0.55, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b252ec4-7b72-49fc-b569-25cf984cce22"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2bc9be3c-ddc1-49ca-82c6-96014f710e33"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=386befb0-eb5a-43cd-a30a-2a3ce039c176"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=12ac29e2-a9b2-4de1-9cb9-ffd54e680206"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f441169c-dc15-4689-be24-cc5ffd16634b"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9d6e7bb1-ae49-4fbf-a34f-13e89ce4d5aa"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7c827983-569b-4fd8-b1b7-30c6a1267378"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0b252ec4-7b72-49fc-b569-25cf984cce22"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.24107142857142858, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bccf502a-0608-48da-ae94-c891986b828b"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d75f35c6-b5d8-4366-b694-cf56acc2b3bc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5dbe27c7-1f81-4c41-b088-34ece1d4f59c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.225, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "addBook"], "isController": true}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3392857142857143, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9578313253012049, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/12ac29e2-a9b2-4de1-9cb9-ffd54e680206"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a908d628-dc30-4304-a074-8932e3efca33"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/970a73d6-8777-4690-ab38-7b19580b1ec3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2bc9be3c-ddc1-49ca-82c6-96014f710e33"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=640de5fd-8eb1-4074-b320-deab6e4f267e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7a18202f-b984-4dbc-97bf-235df5f0eec8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/386befb0-eb5a-43cd-a30a-2a3ce039c176"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b003326e-1f57-43ed-a20a-8c32940437d7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8975c3bb-07a7-40c1-9fcb-db521f736c3f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f441169c-dc15-4689-be24-cc5ffd16634b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1272, 12, 0.9433962264150944, 493.2444968553455, 138, 3483, 167.0, 1394.7, 1665.3999999999996, 2162.3699999999994, 5.081333290722572, 729.7529391438433, 3.7070855225444217], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2354.803571428572, 1734, 3067, 2297.5, 2839.5, 2985.75, 3067.0, 0.25357725049809815, 305.13874227381814, 1.2468373596268791], "isController": true}, {"data": ["deleteBook", 15, 1, 6.666666666666667, 699.6, 150, 1932, 530.0, 1441.8000000000002, 1932.0, 1932.0, 0.084707476846623, 0.015948829625028235, 0.05730438749435283], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, 6.666666666666667, 699.6, 150, 1932, 530.0, 1441.8000000000002, 1932.0, 1932.0, 0.08327226700419692, 0.01567860652188395, 0.05633347177347722], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/640de5fd-8eb1-4074-b320-deab6e4f267e", 3, 0, 0.0, 409.0, 265, 507, 455.0, 507.0, 507.0, 507.0, 0.08072545273524742, 0.03652616513736782, 0.05176729879180906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 204.4736842105263, 141, 439, 147.0, 425.0, 439.0, 439.0, 0.09571981299371272, 0.025612528086208286, 0.05459020584797678], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 176.47368421052633, 142, 423, 149.0, 421.0, 423.0, 423.0, 0.09572125969177755, 0.0711366002201589, 0.048047585431224275], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7a18202f-b984-4dbc-97bf-235df5f0eec8", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5dbe27c7-1f81-4c41-b088-34ece1d4f59c", 3, 0, 0.0, 598.3333333333334, 244, 863, 688.0, 863.0, 863.0, 863.0, 0.07912644405760405, 0.035802655351585166, 0.050741892836419264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 235.21052631578948, 141, 450, 144.0, 450.0, 450.0, 450.0, 0.0957241532191025, 0.025800650672336223, 0.05636881288195197], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8975c3bb-07a7-40c1-9fcb-db521f736c3f", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 216.89473684210523, 140, 428, 144.0, 424.0, 428.0, 428.0, 0.09572125969177755, 0.025799870776299416, 0.05627363118598641], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a908d628-dc30-4304-a074-8932e3efca33", 1, 0, 0.0, 615.0, 615, 615, 615.0, 615.0, 615.0, 615.0, 1.6260162601626016, 0.2937627032520325, 1.1210619918699187], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d75f35c6-b5d8-4366-b694-cf56acc2b3bc", 3, 0, 0.0, 387.0, 248, 542, 371.0, 542.0, 542.0, 542.0, 0.018784163697725238, 0.022202245568502713, 0.012045834142095938], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 340.2666666666667, 142, 1382, 257.0, 780.2000000000003, 1382.0, 1382.0, 0.08581137515589067, 0.18075696895630486, 0.05547012655747646], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 173.3684210526316, 140, 425, 143.0, 421.0, 425.0, 425.0, 0.1211842894135956, 0.09005980883178345, 0.06082883277205873], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 171.94736842105263, 140, 423, 142.0, 420.0, 423.0, 423.0, 0.1211850623465255, 0.051585869981184425, 0.06804202410944925], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 1059.75, 837, 1169, 1116.5, 1169.0, 1169.0, 1169.0, 0.06706008583690987, 19.717891840464056, 0.03824520520386266], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1262.25, 1127, 1519, 1201.5, 1519.0, 1519.0, 1519.0, 0.06630200563567049, 59.65866121747058, 0.037748114536714734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 434.0, 425, 443, 434.0, 443.0, 443.0, 443.0, 0.06750826976304597, 0.11945799297913993, 0.037380067339499085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 177.0, 142, 422, 144.0, 399.5000000000001, 422.0, 422.0, 0.08034903621331062, 0.05971251617024354, 0.040331449818009436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 201.3, 140, 423, 143.0, 422.5, 423.0, 423.0, 0.08053021090862238, 0.04573864322700661, 0.04457473002246792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 504.20000000000005, 138, 1791, 149.0, 1765.8000000000002, 1791.0, 1791.0, 0.07963368504877563, 14.348076970933704, 0.04544719291260203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 368.5, 139, 1135, 143.0, 1133.6, 1135.0, 1135.0, 0.07989964604456802, 4.715858132185975, 0.04567700468211926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9d6e7bb1-ae49-4fbf-a34f-13e89ce4d5aa", 1, 0, 0.0, 838.0, 838, 838, 838.0, 838.0, 838.0, 838.0, 1.1933174224343677, 0.2155895733890215, 0.8227364260143198], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 211.75, 141, 419, 143.5, 419.0, 419.0, 419.0, 0.06784720808738721, 0.05042160679150553, 0.03809779751000746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7c827983-569b-4fd8-b1b7-30c6a1267378", 1, 0, 0.0, 1607.0, 1607, 1607, 1607.0, 1607.0, 1607.0, 1607.0, 0.6222775357809583, 0.11242318761667704, 0.429031191661481], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 827.5500000000003, 140, 2083, 854.0, 1578.4, 2057.7999999999997, 2083.0, 0.10210802007443674, 45.95224862600895, 0.055640893751499707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 322.3157894736842, 139, 1749, 142.0, 1394.0, 1749.0, 1749.0, 0.12097210637905018, 11.487164521268806, 0.07002404718548844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 626.25, 141, 1260, 495.5, 1248.5, 1259.7, 1260.0, 0.10210802007443674, 15.025334754762062, 0.05574060861485365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 298.4736842105263, 141, 1125, 148.0, 698.0, 1125.0, 1125.0, 0.12097133616024246, 3.7733407030344703, 0.07014173741898104], "isController": false}, {"data": ["deleteBooks", 15, 1, 6.666666666666667, 536.2666666666667, 152, 1607, 473.0, 1145.6000000000004, 1607.0, 1607.0, 0.08277551831270384, 0.015585078057313769, 0.05667644050095744], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 711.7, 290, 1933, 456.0, 1907.9, 1933.0, 1933.0, 0.07936696905481877, 19.0885001230188, 0.17443681694802257], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 622.95, 148, 1155, 601.0, 1009.2, 1147.8, 1155.0, 0.10659560293137908, 0.0654771818787475, 0.04819703530979347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 163.3, 141, 457, 146.0, 164.00000000000003, 442.3999999999998, 457.0, 0.10209446801125081, 0.07587293960601744, 0.051246637263459884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 281.49999999999994, 142, 581, 153.0, 449.1, 574.4499999999999, 581.0, 0.10210749877471001, 0.10400207150588138, 0.05394546566124816], "isController": false}, {"data": ["login", 20, 0, 0.0, 2926.3999999999996, 2057, 5293, 2701.5, 4402.500000000001, 5250.4, 5293.0, 0.10254201659129829, 24.677437263512473, 0.18872137155074292], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 170.1578947368421, 143, 444, 152.0, 191.0, 444.0, 444.0, 0.11628618642511782, 0.0941418442836159, 0.041336105330803605], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bccf502a-0608-48da-ae94-c891986b828b", 1, 0, 0.0, 641.0, 641, 641, 641.0, 641.0, 641.0, 641.0, 1.5600624024960998, 0.28184721138845553, 1.0755898985959438], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 993.4500000000002, 288, 2228, 1153.5, 1726.9, 2202.9999999999995, 2228.0, 0.10201999591920016, 61.104747038232, 0.216393975719241], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b252ec4-7b72-49fc-b569-25cf984cce22", 1, 0, 0.0, 343.0, 343, 343, 343.0, 343.0, 343.0, 343.0, 2.9154518950437316, 0.5267173833819242, 2.0100674198250728], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2bc9be3c-ddc1-49ca-82c6-96014f710e33", 1, 0, 0.0, 790.0, 790, 790, 790.0, 790.0, 790.0, 790.0, 1.2658227848101267, 0.22868868670886075, 0.8727254746835442], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=386befb0-eb5a-43cd-a30a-2a3ce039c176", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 0.7496434128630706, 2.8608013485477177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 473.57894736842104, 285, 874, 564.0, 863.0, 874.0, 874.0, 0.09564897831788687, 0.14823723495164692, 0.21511679400985687], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 1034.1666666666667, 142, 1662, 1334.5, 1662.0, 1662.0, 1662.0, 0.099212910906806, 79.13760469029036, 0.17105507246676369], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=12ac29e2-a9b2-4de1-9cb9-ffd54e680206", 1, 0, 0.0, 303.0, 303, 303, 303.0, 303.0, 303.0, 303.0, 3.3003300330033003, 0.5962510313531353, 2.2754228547854787], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f441169c-dc15-4689-be24-cc5ffd16634b", 3, 0, 0.0, 364.0, 241, 499, 352.0, 499.0, 499.0, 499.0, 0.01714971702966901, 0.023642269407763105, 0.010997702652489567], "isController": false}, {"data": ["register", 24, 4, 16.666666666666668, 1454.9583333333335, 259, 2154, 1499.0, 2083.5, 2141.5, 2154.0, 0.09327560609711545, 0.029695163659823862, 0.042083330094597006], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9d6e7bb1-ae49-4fbf-a34f-13e89ce4d5aa", 3, 0, 0.0, 398.3333333333333, 319, 481, 395.0, 481.0, 481.0, 481.0, 0.03288175720110483, 0.02741216803125959, 0.021086283100968915], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7c827983-569b-4fd8-b1b7-30c6a1267378", 3, 0, 0.0, 755.3333333333333, 246, 1609, 411.0, 1609.0, 1609.0, 1609.0, 0.018624401691095673, 0.025663116002085932, 0.011943382594875806], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 154.55555555555554, 145, 176, 152.0, 169.70000000000002, 176.0, 176.0, 0.10048175418813533, 0.07801073689410898, 0.03571812355906373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 557.8947368421052, 285, 1895, 299.0, 1816.0, 1895.0, 1895.0, 0.12086052695189752, 15.387720520765749, 0.26856307368993554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 424.53333333333336, 283, 592, 315.0, 581.2, 592.0, 592.0, 0.07721053769418451, 0.11966125324284259, 0.17364830889619814], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b252ec4-7b72-49fc-b569-25cf984cce22", 3, 0, 0.0, 386.3333333333333, 257, 481, 421.0, 481.0, 481.0, 481.0, 0.0797745040684997, 0.03609588562995267, 0.05115747819496889], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 146.33333333333334, 142, 154, 145.0, 154.0, 154.0, 154.0, 0.056007243603506056, 0.0416225706858087, 0.028113010949416123], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 147.33333333333334, 145, 153, 146.5, 153.0, 153.0, 153.0, 0.056009334889148193, 0.014986872812135356, 0.031942823803967325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 143.0, 139, 147, 143.0, 147.0, 147.0, 147.0, 0.05601090345587274, 0.0150966888220907, 0.032928285039487686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 143.66666666666666, 141, 148, 142.0, 148.0, 148.0, 148.0, 0.05601090345587274, 0.0150966888220907, 0.03298298318739381], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 152.0, 152, 152, 152.0, 152.0, 152.0, 152.0, 6.578947368421052, 1.9402754934210527, 4.0668688322368425], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1635.946428571429, 1133, 2447, 1540.5, 2249.0, 2351.1499999999996, 2447.0, 0.24990628514307137, 298.9747985130576, 0.4934672935149319], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bccf502a-0608-48da-ae94-c891986b828b", 3, 0, 0.0, 517.6666666666666, 273, 963, 317.0, 963.0, 963.0, 963.0, 0.018971252229122135, 0.022423377878887527, 0.012165809534951371], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 4, 16.666666666666668, 1454.9583333333335, 259, 2154, 1499.0, 2083.5, 2141.5, 2154.0, 0.09587421303250136, 0.030522454539643987, 0.043255748458023074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 217.0, 142, 434, 146.0, 434.0, 434.0, 434.0, 0.027121218285125367, 0.007310015865912697, 0.015970795533135348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 143.5, 140, 148, 143.0, 148.0, 148.0, 148.0, 0.02712085050987199, 0.007309916738988935, 0.015944093756780214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 349.27777777777777, 140, 1620, 145.5, 1513.8000000000002, 1620.0, 1620.0, 0.1013896008066106, 10.161018039603904, 0.058637865917885695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 291.5, 141, 1269, 143.5, 1132.2000000000003, 1269.0, 1269.0, 0.1013907430251618, 3.3367631920622314, 0.0587375409083484], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d75f35c6-b5d8-4366-b694-cf56acc2b3bc", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 220.0, 142, 451, 143.5, 451.0, 451.0, 451.0, 0.027121586070353393, 0.007257143147731279, 0.015467779555748419], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 160.72222222222223, 141, 433, 144.5, 177.4000000000004, 433.0, 433.0, 0.1013856032443393, 0.07534613678607638, 0.05089082037850626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5dbe27c7-1f81-4c41-b088-34ece1d4f59c", 1, 0, 0.0, 309.0, 309, 309, 309.0, 309.0, 309.0, 309.0, 3.236245954692557, 0.5846733414239482, 2.2312398867313914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 146.25, 141, 153, 145.5, 153.0, 153.0, 153.0, 0.027121218285125367, 0.020155514760723053, 0.01361358027202582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 174.77777777777777, 140, 425, 144.0, 425.0, 425.0, 425.0, 0.1013896008066106, 0.04404990903099706, 0.056877629792770924], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 222.5, 147, 431, 156.0, 431.0, 431.0, 431.0, 0.026119549176581214, 0.020558942027660603, 0.009284683496362854], "isController": false}, {"data": ["deleteAccount", 15, 1, 6.666666666666667, 687.5333333333332, 144, 1609, 542.0, 1305.4, 1609.0, 1609.0, 0.08185270877897587, 0.01526211965774654, 0.05570886833173266], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1694.4999999999998, 889, 3483, 1550.5, 2901.3000000000006, 3455.2999999999997, 3483.0, 0.10785508590657593, 0.05582343313523949, 0.0496091264277317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 369.25, 291, 593, 296.5, 593.0, 593.0, 593.0, 0.027094029830526844, 0.04199045443461533, 0.06093510810517903], "isController": false}, {"data": ["addBook", 55, 4, 7.2727272727272725, 1459.5272727272727, 721, 2976, 1170.0, 2574.7999999999997, 2680.1999999999994, 2976.0, 0.28503464466544703, 100.33365248576122, 1.034055283441042], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 252.98214285714292, 141, 591, 150.0, 569.9, 575.0, 591.0, 0.25131942699170645, 0.18677156634832873, 0.12148741832118622], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 933.4285714285714, 693, 1411, 843.0, 1266.3, 1325.8999999999999, 1411.0, 0.2511650019510139, 73.85085003655347, 0.12631833594216027], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 217.6785714285714, 140, 489, 146.0, 430.3, 443.09999999999997, 489.0, 0.25185178522439544, 0.445659604322856, 0.12248260648608293], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1373.8571428571427, 970, 1936, 1341.5, 1708.7000000000003, 1828.5, 1936.0, 0.2505917993833652, 225.48294157854934, 0.1257853367998532], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 151.73333333333332, 142, 164, 151.0, 163.4, 164.0, 164.0, 0.07786544850498338, 0.058170964947570604, 0.027678733648255818], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 4, 2.4096385542168677, 216.25903614457818, 142, 797, 154.5, 394.0000000000002, 469.3000000000001, 707.8900000000017, 0.7090532430643061, 1.6029031538987248, 0.33871741718813403], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 266.3333333333333, 153, 546, 160.0, 546.0, 546.0, 546.0, 0.05485613977344415, 0.04248136605502071, 0.019499643435091474], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 168.21052631578948, 144, 450, 151.0, 183.0, 450.0, 450.0, 0.09926180562448736, 0.08055328171284082, 0.03528446996807949], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/12ac29e2-a9b2-4de1-9cb9-ffd54e680206", 3, 0, 0.0, 337.6666666666667, 245, 508, 260.0, 508.0, 508.0, 508.0, 0.06513667846364288, 0.029472650737130075, 0.04177059133247932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 294.83333333333337, 290, 301, 295.5, 301.0, 301.0, 301.0, 0.05593101841062689, 0.08668215450943835, 0.12579017128874387], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a908d628-dc30-4304-a074-8932e3efca33", 3, 0, 0.0, 810.3333333333334, 339, 1382, 710.0, 1382.0, 1382.0, 1382.0, 0.025102711929645465, 0.02517625503100185, 0.016097767741341657], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/970a73d6-8777-4690-ab38-7b19580b1ec3", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 1.3531183792372883, 2.5283037605932206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 543.3333333333334, 284, 2054, 298.0, 1691.3000000000006, 2054.0, 2054.0, 0.10130343756331464, 13.605570493122622, 0.2249538682436235], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2bc9be3c-ddc1-49ca-82c6-96014f710e33", 3, 0, 0.0, 573.6666666666666, 316, 798, 607.0, 798.0, 798.0, 798.0, 0.02107718465018899, 0.024912518706001377, 0.013516293541950624], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=640de5fd-8eb1-4074-b320-deab6e4f267e", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 0.7374043367346939, 2.814094387755102], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 163.5, 146, 221, 152.5, 218.4, 221.0, 221.0, 0.08395107331447232, 0.06960396605858106, 0.029841983092253832], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a18202f-b984-4dbc-97bf-235df5f0eec8", 3, 0, 0.0, 397.6666666666667, 280, 534, 379.0, 534.0, 534.0, 534.0, 0.023845481281297196, 0.02818455160559574, 0.01529153584770686], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/386befb0-eb5a-43cd-a30a-2a3ce039c176", 3, 0, 0.0, 365.3333333333333, 261, 571, 264.0, 571.0, 571.0, 571.0, 0.0724095484057831, 0.03356484275059738, 0.04643450858053149], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 152.14999999999998, 143, 163, 150.5, 163.0, 163.0, 163.0, 0.10484817983559806, 0.08140068649345747, 0.03727025142593524], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b003326e-1f57-43ed-a20a-8c32940437d7", 1, 0, 0.0, 546.0, 546, 546, 546.0, 546.0, 546.0, 546.0, 1.8315018315018314, 0.5848643543956044, 1.0928199404761905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8975c3bb-07a7-40c1-9fcb-db521f736c3f", 3, 0, 0.0, 569.0, 242, 1103, 362.0, 1103.0, 1103.0, 1103.0, 0.019206391887220068, 0.0227013049943021, 0.012316598964135264], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f441169c-dc15-4689-be24-cc5ffd16634b", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 144.93333333333334, 141, 156, 143.0, 154.2, 156.0, 156.0, 0.07738021542651974, 0.05750619525349758, 0.03884124094651479], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 200.73333333333332, 141, 424, 145.0, 423.4, 424.0, 424.0, 0.07737981624872968, 0.020705146144679623, 0.044130676454353646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 201.13333333333333, 140, 429, 145.0, 427.2, 429.0, 429.0, 0.07738101379445539, 0.020856601374286805, 0.045491572562756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 239.73333333333332, 141, 442, 152.0, 436.0, 442.0, 442.0, 0.07726900431161045, 0.02082641131836375, 0.04550118124990341], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 33.333333333333336, 0.31446540880503143], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 8.333333333333334, 0.07861635220125786], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 8.333333333333334, 0.07861635220125786], "isController": false}, {"data": ["401/Unauthorized", 6, 50.0, 0.4716981132075472], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1272, 12, "401/Unauthorized", 6, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
