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

    var data = {"OkPercent": 70.45454545454545, "KoPercent": 29.545454545454547};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5303571428571429, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7dd02b54-2f57-4d2e-8ae1-e5f1ff5ef73f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/df1ea730-aa67-4b34-92b8-e102f23eb7dd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/28c31790-a2c3-4776-abe3-b8f4f7f31526"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4f1e92ee-3226-444b-b650-48999fe54ea1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=23117e26-8f88-482a-9fe7-7efe303eb00f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4def757a-1071-442f-9940-1a678d67588f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c9c3be2f-a4f3-4632-a679-16013de8efca"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=df1ea730-aa67-4b34-92b8-e102f23eb7dd"], "isController": false}, {"data": [0.34, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3cf384fb-3639-46af-9e19-223a9e17df72"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/042eb7a7-e2f5-4b23-b7b5-b93fdd492153"], "isController": false}, {"data": [0.45454545454545453, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c9c3be2f-a4f3-4632-a679-16013de8efca"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7469f842-3bbb-4fa6-a31b-f923c87b83f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f4ffc614-4b56-42f9-b713-9e37d708d60b"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4f1e92ee-3226-444b-b650-48999fe54ea1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/23117e26-8f88-482a-9fe7-7efe303eb00f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b3990e71-beb5-4353-b3e3-61396e4d10a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9742857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/360a7f12-ff23-40a6-bc03-026a55c53ba4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=360a7f12-ff23-40a6-bc03-026a55c53ba4"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f4ffc614-4b56-42f9-b713-9e37d708d60b"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5a5c52be-8be3-48af-9f71-baa9855d1527"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=27607d04-3c26-4996-9542-0e8e1ffc727c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b3990e71-beb5-4353-b3e3-61396e4d10a3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7469f842-3bbb-4fa6-a31b-f923c87b83f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a81fdacd-facc-4194-9deb-41a9ffb8591f"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=042eb7a7-e2f5-4b23-b7b5-b93fdd492153"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5a5c52be-8be3-48af-9f71-baa9855d1527"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=41f39bf9-f490-4934-b107-9f02a10b9e04"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a0d70d4c-04fc-4194-9f52-52df619718ed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/27607d04-3c26-4996-9542-0e8e1ffc727c"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7dd02b54-2f57-4d2e-8ae1-e5f1ff5ef73f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0d70d4c-04fc-4194-9f52-52df619718ed"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/41f39bf9-f490-4934-b107-9f02a10b9e04"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7f89f49c-80cf-4612-ae7e-c609ef0bf181"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.34, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7f89f49c-80cf-4612-ae7e-c609ef0bf181"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 616, 182, 29.545454545454547, 310.6704545454549, 116, 2331, 133.0, 742.3000000000008, 1160.3, 1598.8200000000022, 2.393664560552719, 2.4781279993666114, 1.1529536414496437], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/7dd02b54-2f57-4d2e-8ae1-e5f1ff5ef73f", 3, 0, 0.0, 320.3333333333333, 227, 505, 229.0, 505.0, 505.0, 505.0, 0.01965292926910756, 0.027080354686240985, 0.012602952688848272], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df1ea730-aa67-4b34-92b8-e102f23eb7dd", 3, 0, 0.0, 378.3333333333333, 301, 427, 407.0, 427.0, 427.0, 427.0, 0.03140144655997153, 0.03149344298544019, 0.020136995352585906], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/28c31790-a2c3-4776-abe3-b8f4f7f31526", 2, 0, 0.0, 218.0, 217, 219, 218.0, 219.0, 219.0, 219.0, 0.017766407277120422, 0.025296310361368722, 0.011043279523327293], "isController": false}, {"data": ["see books", 57, 57, 100.0, 690.6842105263157, 475, 959, 739.0, 899.6, 914.8, 959.0, 0.24791555213403096, 1.5930893335964718, 0.4161785489437493], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 13, 100.0, 183.15384615384613, 118, 377, 127.0, 376.6, 377.0, 377.0, 0.06403436182369862, 0.03182958024244395, 0.03214224802478623], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 21, 0, 0.0, 167.00000000000003, 121, 396, 130.0, 381.0, 394.59999999999997, 396.0, 0.10842906931715503, 0.0841807715890022, 0.03854314573383245], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4f1e92ee-3226-444b-b650-48999fe54ea1", 3, 0, 0.0, 441.33333333333337, 252, 739, 333.0, 739.0, 739.0, 739.0, 0.021498903555918648, 0.02962397745839962, 0.013786731772512936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 23, 23, 100.0, 135.304347826087, 121, 350, 126.0, 130.2, 306.19999999999936, 350.0, 0.10585127435729869, 0.052615526023305687, 0.053132377948878436], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=23117e26-8f88-482a-9fe7-7efe303eb00f", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.43324715227817745, 1.6533648081534773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4def757a-1071-442f-9940-1a678d67588f", 1, 0, 0.0, 350.0, 350, 350, 350.0, 350.0, 350.0, 350.0, 2.857142857142857, 0.9123883928571429, 1.7047991071428572], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c9c3be2f-a4f3-4632-a679-16013de8efca", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 0.725558483935743, 2.7688880522088355], "isController": false}, {"data": ["https://demoqa.com/books", 57, 57, 100.0, 237.80701754385967, 117, 519, 129.0, 510.0, 515.2, 519.0, 0.26195936412811194, 0.13021222298946186, 0.12663074730802285], "isController": false}, {"data": ["deleteBook", 15, 0, 0.0, 610.9999999999999, 417, 1459, 480.0, 1171.6000000000001, 1459.0, 1459.0, 0.08392923087252828, 0.015162995811931378, 0.05704564910867157], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 0, 0.0, 610.9999999999999, 417, 1459, 480.0, 1171.6000000000001, 1459.0, 1459.0, 0.08172516372274465, 0.014764800086628673, 0.05554757221780301], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=df1ea730-aa67-4b34-92b8-e102f23eb7dd", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 4, 16.0, 1084.6, 202, 1887, 1160.0, 1812.8000000000002, 1870.5, 1887.0, 0.09822256447329132, 0.03129309515016265, 0.04431525858072323], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3cf384fb-3639-46af-9e19-223a9e17df72", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 1.557736280487805, 2.9106326219512195], "isController": false}, {"data": ["deleteAccount", 15, 0, 0.0, 635.3333333333334, 396, 1394, 515.0, 1131.8000000000002, 1394.0, 1394.0, 0.081203984408835, 0.01467064171448679, 0.05527263391890429], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 2, 0, 0.0, 324.5, 143, 506, 324.5, 506.0, 506.0, 506.0, 0.024773324084625674, 0.019499315636922164, 0.008806142545706783], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/042eb7a7-e2f5-4b23-b7b5-b93fdd492153", 3, 0, 0.0, 429.3333333333333, 294, 529, 465.0, 529.0, 529.0, 529.0, 0.02675108118953141, 0.026829453497703867, 0.01715482745552633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1250.1363636363637, 803, 2331, 1189.5, 1573.5, 2222.5499999999984, 2331.0, 0.091000091000091, 0.04709965647465647, 0.04185648716898717], "isController": false}, {"data": ["goToProfile", 16, 0, 0.0, 272.5625, 193, 485, 232.0, 444.40000000000003, 485.0, 485.0, 0.08087997411840829, 0.17602155988403834, 0.05228763951795535], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 2, 2, 100.0, 122.0, 122, 122, 122.0, 122.0, 122.0, 122.0, 0.025738369474293803, 0.012793779357827682, 0.012919454990026382], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c9c3be2f-a4f3-4632-a679-16013de8efca", 3, 0, 0.0, 387.3333333333333, 319, 508, 335.0, 508.0, 508.0, 508.0, 0.061653548161696714, 0.027896624982017715, 0.03953694331983806], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7469f842-3bbb-4fa6-a31b-f923c87b83f6", 1, 0, 0.0, 1188.0, 1188, 1188, 1188.0, 1188.0, 1188.0, 1188.0, 0.8417508417508417, 0.1520741266835017, 0.5803477483164984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f4ffc614-4b56-42f9-b713-9e37d708d60b", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["addBook", 59, 59, 100.0, 763.0508474576272, 517, 1539, 744.0, 941.0, 1012.0, 1539.0, 0.27204109203749555, 0.8672255396442257, 0.5328477010798648], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4f1e92ee-3226-444b-b650-48999fe54ea1", 1, 0, 0.0, 750.0, 750, 750, 750.0, 750.0, 750.0, 750.0, 1.3333333333333333, 0.24088541666666666, 0.9192708333333334], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/23117e26-8f88-482a-9fe7-7efe303eb00f", 3, 0, 0.0, 304.0, 220, 438, 254.0, 438.0, 438.0, 438.0, 0.04599886536132109, 0.02957283824498996, 0.029497970300065936], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b3990e71-beb5-4353-b3e3-61396e4d10a3", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 0.8603050595238095, 3.283110119047619], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 23, 0, 0.0, 151.3913043478261, 122, 379, 129.0, 284.00000000000034, 378.8, 379.0, 0.1061438849584885, 0.07929694530590206, 0.037730834106337714], "isController": false}, {"data": ["deleteBooks", 15, 0, 0.0, 548.1999999999999, 202, 1188, 452.0, 1081.2, 1188.0, 1188.0, 0.08159047023307676, 0.014740465813592972, 0.05625280467241426], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 2, 1.1428571428571428, 207.23428571428573, 118, 1162, 134.0, 382.8, 470.79999999999995, 816.9600000000041, 0.7514051275885907, 1.6198860507541961, 0.3616850005045149], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 154.1, 118, 381, 127.5, 357.5000000000001, 381.0, 381.0, 0.06400450591721657, 0.049565989445656974, 0.022751601712760576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/360a7f12-ff23-40a6-bc03-026a55c53ba4", 3, 0, 0.0, 982.0, 277, 1712, 957.0, 1712.0, 1712.0, 1712.0, 0.05982650314089142, 0.027069934689400735, 0.03836530312094925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=360a7f12-ff23-40a6-bc03-026a55c53ba4", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 0.8943765470297029, 3.4131342821782176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 15, 100.0, 142.6, 121, 379, 127.0, 229.00000000000009, 379.0, 379.0, 0.07357918591988698, 0.036574028938693826, 0.03693330230744327], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 131.4285714285714, 122, 138, 131.5, 137.0, 138.0, 138.0, 0.08707659008073243, 0.07066469370809439, 0.03095300663026036], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f4ffc614-4b56-42f9-b713-9e37d708d60b", 3, 0, 0.0, 377.0, 200, 651, 280.0, 651.0, 651.0, 651.0, 0.032341177865697866, 0.02696150928191805, 0.020739622524552345], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 512.6363636363636, 142, 1231, 472.5, 1096.2999999999997, 1230.55, 1231.0, 0.09095569630719874, 0.055870247048074216, 0.04112547596702443], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5a5c52be-8be3-48af-9f71-baa9855d1527", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.34281605787476277, 1.3082601992409866], "isController": false}, {"data": ["login", 22, 3, 13.636363636363637, 2208.6363636363635, 1356, 3315, 2161.5, 2997.9, 3273.1499999999996, 3315.0, 0.08998175824355609, 0.1327598402210279, 0.13533211704581707], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=27607d04-3c26-4996-9542-0e8e1ffc727c", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3990e71-beb5-4353-b3e3-61396e4d10a3", 3, 0, 0.0, 670.0, 396, 1129, 485.0, 1129.0, 1129.0, 1129.0, 0.07345020076388209, 0.033234303080011754, 0.04710185400548428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 10, 100.0, 124.30000000000001, 116, 131, 125.5, 130.7, 131.0, 131.0, 0.060445605000060444, 0.03004571576663161, 0.03034086032229597], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7469f842-3bbb-4fa6-a31b-f923c87b83f6", 3, 0, 0.0, 317.0, 232, 482, 237.0, 482.0, 482.0, 482.0, 0.04174145343740869, 0.02710748685144217, 0.026767794033754923], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 0, 0.0, 147.15384615384616, 121, 378, 128.0, 280.3999999999999, 378.0, 378.0, 0.06049071932771545, 0.04897149054948839, 0.021502560386023852], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a81fdacd-facc-4194-9deb-41a9ffb8591f", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 1.1612215909090908, 2.169744318181818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 21, 21, 100.0, 137.71428571428572, 116, 376, 127.0, 133.4, 351.79999999999967, 376.0, 0.1078892747785701, 0.05362855552958221, 0.05415535862908695], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=042eb7a7-e2f5-4b23-b7b5-b93fdd492153", 1, 0, 0.0, 660.0, 660, 660, 660.0, 660.0, 660.0, 660.0, 1.5151515151515151, 0.27373342803030304, 1.044625946969697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a5c52be-8be3-48af-9f71-baa9855d1527", 3, 0, 0.0, 315.0, 227, 445, 273.0, 445.0, 445.0, 445.0, 0.042726521776283936, 0.027469036623750248, 0.027399494758879997], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=41f39bf9-f490-4934-b107-9f02a10b9e04", 1, 0, 0.0, 739.0, 739, 739, 739.0, 739.0, 739.0, 739.0, 1.3531799729364007, 0.2444709912043302, 0.9329541610284168], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0d70d4c-04fc-4194-9f52-52df619718ed", 3, 0, 0.0, 554.0, 193, 776, 693.0, 776.0, 776.0, 776.0, 0.017770511613029342, 0.024498084857154705, 0.011395803345594988], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 163.0666666666667, 121, 384, 131.0, 371.40000000000003, 384.0, 384.0, 0.07411360132811573, 0.061447702663642835, 0.02634506922210364], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/27607d04-3c26-4996-9542-0e8e1ffc727c", 3, 0, 0.0, 645.3333333333334, 214, 871, 851.0, 871.0, 871.0, 871.0, 0.019862156632967205, 0.023476396723406227, 0.012737125184552538], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 18, 100.0, 142.88888888888889, 118, 351, 128.0, 202.50000000000023, 351.0, 351.0, 0.09881260190049572, 0.049116810905617495, 0.049599294313334756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 156.99999999999997, 118, 388, 129.0, 379.0, 388.0, 388.0, 0.10105490088198472, 0.07845570918083775, 0.035921859297893], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7dd02b54-2f57-4d2e-8ae1-e5f1ff5ef73f", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0d70d4c-04fc-4194-9f52-52df619718ed", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41f39bf9-f490-4934-b107-9f02a10b9e04", 3, 0, 0.0, 643.6666666666667, 206, 1394, 331.0, 1394.0, 1394.0, 1394.0, 0.020608641890499414, 0.024358717026172975, 0.013215828295665316], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f89f49c-80cf-4612-ae7e-c609ef0bf181", 3, 0, 0.0, 589.6666666666666, 267, 987, 515.0, 987.0, 987.0, 987.0, 0.05089144854026362, 0.03225444345960067, 0.03263546667458311], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 14, 100.0, 127.21428571428572, 123, 132, 127.0, 131.5, 132.0, 132.0, 0.09239643349766699, 0.0459275240725708, 0.04637867853300863], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 3, 100.0, 123.66666666666667, 120, 130, 121.0, 130.0, 130.0, 130.0, 0.07528986598403856, 0.03742435721276916, 0.04227702435627165], "isController": false}, {"data": ["register", 25, 4, 16.0, 1084.6, 202, 1887, 1160.0, 1812.8000000000002, 1870.5, 1887.0, 0.09903853391277478, 0.031553057913773094, 0.044683401042677685], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7f89f49c-80cf-4612-ae7e-c609ef0bf181", 1, 0, 0.0, 1010.0, 1010, 1010, 1010.0, 1010.0, 1010.0, 1010.0, 0.9900990099009901, 0.1788753094059406, 0.6826268564356436], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 2.197802197802198, 0.6493506493506493], "isController": false}, {"data": ["401/Unauthorized", 2, 1.098901098901099, 0.3246753246753247], "isController": false}, {"data": ["404/Not Found", 176, 96.7032967032967, 28.571428571428573], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 616, 182, "404/Not Found", 176, "406/Not Acceptable", 4, "401/Unauthorized", 2, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 13, "404/Not Found", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 23, 23, "404/Not Found", 23, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books", 57, 57, "404/Not Found", 57, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 2, 2, "404/Not Found", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 10, "404/Not Found", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 21, 21, "404/Not Found", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 3, "404/Not Found", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
