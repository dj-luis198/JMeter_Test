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

    var data = {"OkPercent": 99.68203497615262, "KoPercent": 0.3179650238473768};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7491479209270621, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4ab9b25c-aa76-4002-96f9-c67e3c8e0c1f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/da1385aa-599c-4fee-a87d-177c1d0edc5a"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5384615384615384, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dd8b6d14-d40a-4ad8-88c9-6bb438dada3c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1c6863c5-bcd6-45c8-bf62-37a0f6e48555"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0407b4c0-ed12-4d4b-8780-859bc5a73451"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=750e34b2-e31f-48c2-b802-dd42b8df6cda"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bfd699a7-8c71-43af-8392-057900da1d1c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=09d83f0f-5c28-4774-ac3d-db59e5090d4a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f3b8e5cb-08ea-4b2a-87c5-adc9c1cf42a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/071c9b8e-0ef9-4ddc-b024-9f92ecc23b3b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eecd5430-7774-4dd0-a5de-6ea0a5847543"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a9864667-3fe6-4c10-a2c9-8b4ee334b8c0"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/35900fb0-f815-485e-8585-a8833ece5ddf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8532b65b-1d01-4cca-8ade-7a9444078a2d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0d1f079d-2659-4e08-bef9-209453747ac9"], "isController": false}, {"data": [0.4117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7d8c7399-76fc-40a1-8c35-a49d1539050c"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e16b83ad-0ff4-4b7b-9d0d-23055063fbf1"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "register"], "isController": true}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dd8b6d14-d40a-4ad8-88c9-6bb438dada3c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da1385aa-599c-4fee-a87d-177c1d0edc5a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ee5e77cc-1337-4799-ac0f-aad51baeec01"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/09d83f0f-5c28-4774-ac3d-db59e5090d4a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bfd699a7-8c71-43af-8392-057900da1d1c"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4ab9b25c-aa76-4002-96f9-c67e3c8e0c1f"], "isController": false}, {"data": [0.34210526315789475, 500, 1500, "addBook"], "isController": true}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.32407407407407407, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9791666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/71f956cd-f9fb-4ad4-95c3-8abc4cbf423e"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=071c9b8e-0ef9-4ddc-b024-9f92ecc23b3b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a9864667-3fe6-4c10-a2c9-8b4ee334b8c0"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/eecd5430-7774-4dd0-a5de-6ea0a5847543"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/750e34b2-e31f-48c2-b802-dd42b8df6cda"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7d8c7399-76fc-40a1-8c35-a49d1539050c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1c6863c5-bcd6-45c8-bf62-37a0f6e48555"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35900fb0-f815-485e-8585-a8833ece5ddf"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e16b83ad-0ff4-4b7b-9d0d-23055063fbf1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1258, 4, 0.3179650238473768, 493.59856915739147, 136, 4963, 166.5, 1343.3000000000018, 1645.2999999999997, 2183.3800000000015, 5.028540364229411, 701.441755728309, 3.6612427837148043], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2368.092592592593, 1721, 3252, 2366.5, 2812.5, 3030.0, 3252.0, 0.2560103162675592, 308.06639078641393, 1.2588007250069928], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4ab9b25c-aa76-4002-96f9-c67e3c8e0c1f", 3, 0, 0.0, 508.3333333333333, 334, 699, 492.0, 699.0, 699.0, 699.0, 0.01965988400668436, 0.02708993782561683, 0.012607412595432353], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da1385aa-599c-4fee-a87d-177c1d0edc5a", 3, 0, 0.0, 468.3333333333333, 307, 717, 381.0, 717.0, 717.0, 717.0, 0.017892715279186, 0.024666552476351796, 0.011474169628905085], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 867.1538461538461, 464, 1248, 1021.0, 1208.3999999999999, 1248.0, 1248.0, 0.07443287872021252, 0.013447346253163397, 0.050591097255144456], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 867.1538461538461, 464, 1248, 1021.0, 1208.3999999999999, 1248.0, 1248.0, 0.0755010657265816, 0.013640329257243747, 0.05131713061103593], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd8b6d14-d40a-4ad8-88c9-6bb438dada3c", 3, 0, 0.0, 348.6666666666667, 248, 488, 310.0, 488.0, 488.0, 488.0, 0.040775828089108776, 0.026214928540361275, 0.026148561632664158], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 162.82352941176472, 136, 428, 148.0, 205.5999999999998, 428.0, 428.0, 0.13573071027082267, 0.06030223536503577, 0.07606783142245784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 147.11764705882354, 142, 152, 148.0, 151.2, 152.0, 152.0, 0.13573504519178564, 0.10087340760834851, 0.06813263010603303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 289.5294117647059, 139, 1130, 145.0, 933.9999999999998, 1130.0, 1130.0, 0.13572854291417166, 4.727420159680639, 0.07855382984031936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 349.4117647058824, 138, 1612, 147.0, 1568.0, 1612.0, 1612.0, 0.13573287769669293, 14.400831039514237, 0.07842378698720917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1c6863c5-bcd6-45c8-bf62-37a0f6e48555", 1, 0, 0.0, 2348.0, 2348, 2348, 2348.0, 2348.0, 2348.0, 2348.0, 0.42589437819420783, 0.076943808560477, 0.2936342099659285], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 332.14285714285717, 233, 676, 276.0, 584.0, 676.0, 676.0, 0.06886307070269845, 0.16530307283007545, 0.04451889922381482], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0407b4c0-ed12-4d4b-8780-859bc5a73451", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 1.2425522859922178, 2.321710846303502], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=750e34b2-e31f-48c2-b802-dd42b8df6cda", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.4059866573033708, 1.5493328651685394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bfd699a7-8c71-43af-8392-057900da1d1c", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 164.23529411764704, 138, 433, 149.0, 208.19999999999982, 433.0, 433.0, 0.09962143853357243, 0.07403507297270373, 0.0500052923889221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 234.94117647058826, 143, 447, 150.0, 446.2, 447.0, 447.0, 0.09962260612737629, 0.053061856848175146, 0.05533953361969949], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 873.3333333333334, 859, 889, 872.0, 889.0, 889.0, 889.0, 0.12359920896506263, 36.34227131571358, 0.07049017386288728], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1451.6666666666667, 1235, 1624, 1496.0, 1624.0, 1624.0, 1624.0, 0.11988491048593351, 107.87265319043718, 0.06825478790361253], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=09d83f0f-5c28-4774-ac3d-db59e5090d4a", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 444.6666666666667, 441, 449, 444.0, 449.0, 449.0, 449.0, 0.125791437796134, 0.22259188016269027, 0.06965209495157029], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3b8e5cb-08ea-4b2a-87c5-adc9c1cf42a8", 1, 0, 0.0, 289.0, 289, 289, 289.0, 289.0, 289.0, 289.0, 3.4602076124567476, 1.1049686418685123, 2.064635596885813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 176.44444444444446, 138, 415, 148.0, 415.0, 415.0, 415.0, 0.056333796522326965, 0.041865253079580875, 0.02827692520749615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 248.77777777777777, 144, 447, 150.0, 447.0, 447.0, 447.0, 0.05633414913527081, 0.015073785999086136, 0.03212806942870913], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/071c9b8e-0ef9-4ddc-b024-9f92ecc23b3b", 3, 0, 0.0, 672.0, 306, 1392, 318.0, 1392.0, 1392.0, 1392.0, 0.018425594378965342, 0.021778428772793994, 0.011815892228698477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 243.66666666666666, 142, 445, 150.0, 445.0, 445.0, 445.0, 0.05624156376543519, 0.015158858983652452, 0.03306388807303905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 211.11111111111111, 137, 440, 150.0, 440.0, 440.0, 440.0, 0.056231373357575304, 0.015156112350283968, 0.0331128106783378], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 153.66666666666666, 150, 160, 151.0, 160.0, 160.0, 160.0, 0.12733446519524616, 0.09463039845076401, 0.07150128660865875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 1025.8823529411766, 144, 1901, 1480.0, 1794.6, 1901.0, 1901.0, 0.08489515448421199, 44.94401562507802, 0.04561749052420261], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 375.2941176470589, 136, 1622, 148.0, 1351.5999999999997, 1622.0, 1622.0, 0.09963078005040145, 15.84234138743187, 0.0570610568188478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 680.2352941176471, 139, 1178, 881.0, 1154.0, 1178.0, 1178.0, 0.08489897022543173, 14.693608356056293, 0.04570245002197385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 325.2352941176471, 138, 1179, 149.0, 1178.2, 1179.0, 1179.0, 0.09962610907300835, 5.191534399576882, 0.05715567275460331], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 731.6153846153846, 293, 2348, 480.0, 1899.9999999999995, 2348.0, 2348.0, 0.07555240430997408, 0.013649604294282426, 0.0520898412527751], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 461.1111111111111, 294, 860, 326.0, 860.0, 860.0, 860.0, 0.056179073919177036, 0.08706659209934957, 0.12634805394127413], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eecd5430-7774-4dd0-a5de-6ea0a5847543", 1, 0, 0.0, 1001.0, 1001, 1001, 1001.0, 1001.0, 1001.0, 1001.0, 0.999000999000999, 0.18048357892107894, 0.6887643606393608], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9864667-3fe6-4c10-a2c9-8b4ee334b8c0", 3, 0, 0.0, 455.0, 245, 676, 444.0, 676.0, 676.0, 676.0, 0.0714217693552995, 0.03231649069136273, 0.045801069540996095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 654.8181818181818, 169, 2194, 583.0, 1161.8, 2046.999999999998, 2194.0, 0.0963935661676109, 0.05921050109319067, 0.043584200327738125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 149.47058823529412, 144, 155, 150.0, 154.2, 155.0, 155.0, 0.0848934587093198, 0.06308976765409412, 0.04261253689120154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 228.70588235294116, 143, 445, 148.0, 440.2, 445.0, 445.0, 0.0848972742980993, 0.09772355137783283, 0.04422383291217627], "isController": false}, {"data": ["login", 22, 0, 0.0, 2982.818181818182, 1367, 5398, 2722.0, 4954.099999999999, 5375.2, 5398.0, 0.09708352271975076, 15.97469977885918, 0.16843094824124372], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/35900fb0-f815-485e-8585-a8833ece5ddf", 3, 0, 0.0, 354.3333333333333, 242, 504, 317.0, 504.0, 504.0, 504.0, 0.07374268718352096, 0.0333666455680645, 0.047289418538911554], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 171.05882352941177, 146, 450, 153.0, 221.9999999999998, 450.0, 450.0, 0.09906298074681834, 0.0801984482803832, 0.035213793937345576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8532b65b-1d01-4cca-8ade-7a9444078a2d", 1, 0, 0.0, 384.0, 384, 384, 384.0, 384.0, 384.0, 384.0, 2.6041666666666665, 0.83160400390625, 1.5538533528645833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d1f079d-2659-4e08-bef9-209453747ac9", 2, 0, 0.0, 268.5, 265, 272, 268.5, 272.0, 272.0, 272.0, 0.015959653994701395, 0.026994258514475407, 0.00992023414807367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1176.8235294117646, 295, 2051, 1630.0, 1946.1999999999998, 2051.0, 2051.0, 0.08483076262855603, 59.75241989886427, 0.17801887578031828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d8c7399-76fc-40a1-8c35-a49d1539050c", 3, 0, 0.0, 1044.0, 458, 1476, 1198.0, 1476.0, 1476.0, 1476.0, 0.07077307792115879, 0.032022974710420156, 0.04538507926584727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 508.29411764705884, 286, 1757, 298.0, 1718.6, 1757.0, 1757.0, 0.13557159376370667, 19.26665642818693, 0.3008228373340245], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 1605.6666666666667, 1387, 1774, 1656.0, 1774.0, 1774.0, 1774.0, 0.11912325285895807, 142.5128243626906, 0.268608975440756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e16b83ad-0ff4-4b7b-9d0d-23055063fbf1", 1, 0, 0.0, 934.0, 934, 934, 934.0, 934.0, 934.0, 934.0, 1.0706638115631693, 0.1934304737687366, 0.738172510706638], "isController": false}, {"data": ["register", 23, 3, 13.043478260869565, 1250.0434782608695, 673, 1987, 1191.0, 1808.8000000000002, 1961.5999999999997, 1987.0, 0.09307294490890991, 0.029749198763343827, 0.04199189506632459], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 631.7058823529412, 290, 2056, 568.0, 1557.5999999999995, 2056.0, 2056.0, 0.09953336416915988, 21.14053662754615, 0.21935877276825705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 183.33333333333331, 141, 442, 152.0, 434.8, 442.0, 442.0, 0.11281022812735021, 0.08758215953246427, 0.04010051077964402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dd8b6d14-d40a-4ad8-88c9-6bb438dada3c", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da1385aa-599c-4fee-a87d-177c1d0edc5a", 1, 0, 0.0, 1228.0, 1228, 1228, 1228.0, 1228.0, 1228.0, 1228.0, 0.8143322475570033, 0.1471205720684039, 0.5614439128664496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 394.8, 286, 597, 302.0, 595.8, 597.0, 597.0, 0.08698425584969122, 0.13480860745455073, 0.195629630099452], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee5e77cc-1337-4799-ac0f-aad51baeec01", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 1.3764480064655171, 2.571895204741379], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/09d83f0f-5c28-4774-ac3d-db59e5090d4a", 3, 0, 0.0, 314.0, 241, 441, 260.0, 441.0, 441.0, 441.0, 0.03587915899251321, 0.02956059616212596, 0.023008445057047862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 176.33333333333334, 138, 427, 147.0, 427.0, 427.0, 427.0, 0.06346609500169244, 0.04716572099246869, 0.031857004717646395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 144.44444444444446, 137, 150, 144.0, 150.0, 150.0, 150.0, 0.06346878041212395, 0.016982857258712854, 0.03619703882878944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 174.11111111111111, 137, 418, 142.0, 418.0, 418.0, 418.0, 0.06346296231005183, 0.01710525156013116, 0.03730928057680782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 176.66666666666663, 138, 434, 146.0, 434.0, 434.0, 434.0, 0.06346564745538012, 0.017105975290707925, 0.037372837319916224], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1640.9444444444453, 1132, 2637, 1498.0, 2199.5, 2415.75, 2637.0, 0.255012892318445, 305.0840760387053, 0.503550847917867], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 3, 13.043478260869565, 1250.0434782608695, 673, 1987, 1191.0, 1808.8000000000002, 1961.5999999999997, 1987.0, 0.09599772944500791, 0.030684056864046346, 0.04331147558944693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 175.0, 137, 426, 145.0, 426.0, 426.0, 426.0, 0.04172809970233955, 0.011247026872896209, 0.024572308711436282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 180.33333333333334, 143, 418, 150.0, 418.0, 418.0, 418.0, 0.041777880933039344, 0.01126044447023326, 0.02456082453290008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 302.27777777777777, 139, 1764, 149.0, 578.7000000000019, 1764.0, 1764.0, 0.11335726431135462, 5.6954706786479, 0.06610047074752819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 226.4444444444444, 138, 1008, 148.0, 499.5000000000008, 1008.0, 1008.0, 0.11389954060518623, 1.8895632229456953, 0.06652791092423149], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 211.22222222222223, 147, 439, 150.0, 439.0, 439.0, 439.0, 0.041729841009305754, 0.011165992613818142, 0.023799049950619686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 180.77777777777774, 139, 446, 150.0, 430.70000000000005, 446.0, 446.0, 0.11414077362079898, 0.08482532102092581, 0.05729331800887762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 216.22222222222223, 138, 451, 151.0, 451.0, 451.0, 451.0, 0.04178079012116429, 0.031049981720904323, 0.020971998166287545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 240.33333333333331, 136, 444, 148.5, 443.1, 444.0, 444.0, 0.11414294501480687, 0.04006645259580081, 0.06456458033443883], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 254.33333333333334, 146, 510, 154.0, 510.0, 510.0, 510.0, 0.041005827383691525, 0.03227607116333532, 0.014576290202796598], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 669.6923076923077, 441, 1392, 536.0, 1314.3999999999999, 1392.0, 1392.0, 0.07551071380858615, 0.013642072318934021, 0.0513974292232271], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bfd699a7-8c71-43af-8392-057900da1d1c", 3, 0, 0.0, 369.6666666666667, 248, 478, 383.0, 478.0, 478.0, 478.0, 0.056948689231002866, 0.03661251993204123, 0.03651983000816265], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1797.5909090909092, 937, 4963, 1510.0, 2761.3, 4633.149999999995, 4963.0, 0.0945183644885912, 0.04892063787007162, 0.04347475554113912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 430.3333333333333, 293, 877, 302.0, 877.0, 877.0, 877.0, 0.04169832650716285, 0.06462426188170647, 0.09378051361913675], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4ab9b25c-aa76-4002-96f9-c67e3c8e0c1f", 1, 0, 0.0, 562.0, 562, 562, 562.0, 562.0, 562.0, 562.0, 1.779359430604982, 0.3214663033807829, 1.2267849199288254], "isController": false}, {"data": ["addBook", 57, 1, 1.7543859649122806, 1478.9473684210525, 738, 2889, 1194.0, 2561.2000000000003, 2610.2999999999997, 2889.0, 0.277097188192743, 94.07851170553319, 1.0074586845661728], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 282.462962962963, 139, 804, 153.0, 588.0, 600.5, 804.0, 0.2564687108172803, 0.19059832903510773, 0.12397657407671264], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 940.148148148148, 684, 1342, 882.0, 1238.5, 1320.5, 1342.0, 0.2566539923954373, 75.46479547884981, 0.12907891219106463], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 224.88888888888886, 137, 569, 150.5, 443.0, 444.25, 569.0, 0.2573082696018869, 0.45531502394396395, 0.12513624830248016], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1356.1481481481478, 981, 2037, 1325.0, 1628.5, 1835.75, 2037.0, 0.2560236679657497, 230.37054647718543, 0.12851188020937046], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 169.2, 145, 415, 152.0, 259.0000000000001, 415.0, 415.0, 0.089087388789243, 0.06655454338258876, 0.03166778273367622], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 1, 0.5952380952380952, 216.79761904761895, 140, 1359, 156.0, 333.79999999999995, 443.2499999999998, 880.8300000000015, 0.6916056365859381, 1.4550123140795264, 0.33395524452170117], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 187.22222222222223, 149, 444, 155.0, 444.0, 444.0, 444.0, 0.06405785135731469, 0.04960730090463922, 0.02277056434967046], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 186.23529411764707, 144, 456, 152.0, 432.0, 456.0, 456.0, 0.12255697096841636, 0.09945785436987693, 0.043565173273929246], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/71f956cd-f9fb-4ad4-95c3-8abc4cbf423e", 1, 0, 0.0, 313.0, 313, 313, 313.0, 313.0, 313.0, 313.0, 3.1948881789137378, 1.0202426118210863, 1.9063248801916932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 357.1111111111111, 288, 861, 297.0, 861.0, 861.0, 861.0, 0.06339903351695572, 0.09825611932754759, 0.14258591229448148], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=071c9b8e-0ef9-4ddc-b024-9f92ecc23b3b", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a9864667-3fe6-4c10-a2c9-8b4ee334b8c0", 1, 0, 0.0, 322.0, 322, 322, 322.0, 322.0, 322.0, 322.0, 3.105590062111801, 0.5610685170807453, 2.1411587732919255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 563.8333333333334, 289, 1919, 564.0, 993.8000000000014, 1919.0, 1919.0, 0.11324957059537816, 7.692756028573496, 0.25309116275850785], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eecd5430-7774-4dd0-a5de-6ea0a5847543", 3, 0, 0.0, 360.0, 233, 610, 237.0, 610.0, 610.0, 610.0, 0.019796492061606684, 0.02339878342307743, 0.012695016068152723], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/750e34b2-e31f-48c2-b802-dd42b8df6cda", 3, 0, 0.0, 412.6666666666667, 332, 457, 449.0, 457.0, 457.0, 457.0, 0.020524609006198433, 0.024259393001792483, 0.013161940020250947], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7d8c7399-76fc-40a1-8c35-a49d1539050c", 1, 0, 0.0, 293.0, 293, 293, 293.0, 293.0, 293.0, 293.0, 3.4129692832764507, 0.6166008959044369, 2.353082337883959], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 154.0, 149, 162, 152.0, 162.0, 162.0, 162.0, 0.05452001187324703, 0.04520262703162767, 0.01938016047056828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1c6863c5-bcd6-45c8-bf62-37a0f6e48555", 3, 0, 0.0, 406.66666666666663, 237, 742, 241.0, 742.0, 742.0, 742.0, 0.023078698361412416, 0.0276839203977229, 0.01479981633202554], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 186.94117647058823, 145, 449, 153.0, 439.4, 449.0, 449.0, 0.08162834136012023, 0.06337356580204648, 0.02901632446785524], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35900fb0-f815-485e-8585-a8833ece5ddf", 1, 0, 0.0, 534.0, 534, 534, 534.0, 534.0, 534.0, 534.0, 1.8726591760299625, 0.33832221441947563, 1.2911107209737827], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e16b83ad-0ff4-4b7b-9d0d-23055063fbf1", 3, 0, 0.0, 351.6666666666667, 239, 536, 280.0, 536.0, 536.0, 536.0, 0.018098346414415937, 0.02495003159669645, 0.011606035949348762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 147.00000000000003, 139, 155, 148.0, 153.2, 155.0, 155.0, 0.08705897374881745, 0.06469910060825203, 0.043699523932511884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 226.26666666666662, 144, 447, 149.0, 445.8, 447.0, 447.0, 0.08705644740049448, 0.02329440096458544, 0.04964938015809451], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 242.93333333333328, 138, 448, 149.0, 447.4, 448.0, 448.0, 0.08705745792222867, 0.023464705455600695, 0.051180263348810213], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 165.4666666666667, 139, 442, 147.0, 269.2000000000001, 442.0, 442.0, 0.08705543690221933, 0.023464160727551305, 0.05126409028519361], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 75.0, 0.2384737678855326], "isController": false}, {"data": ["401/Unauthorized", 1, 25.0, 0.0794912559618442], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1258, 4, "406/Not Acceptable", 3, "401/Unauthorized", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
