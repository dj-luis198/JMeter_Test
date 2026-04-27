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

    var data = {"OkPercent": 98.80329094988781, "KoPercent": 1.1967090501121915};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7902391725921137, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.075, 500, 1500, "see books"], "isController": true}, {"data": [0.7692307692307693, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3cfe7172-1dcc-473b-8780-e65f2fa87694"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/54023440-535f-4abd-9d94-e3f1fb7aaad2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/03985843-e3ae-43bb-9a04-da1fa2f85e4c"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f67e30a9-e229-4a55-ad4a-62d65f58b5e4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=91a81b5b-469d-4327-89a4-5437ebb5c0af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/12e423ef-0398-45ff-816f-03fef82273db"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/27276ab0-8be4-4cbc-9da9-4558abc124c7"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=27276ab0-8be4-4cbc-9da9-4558abc124c7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7e1181b9-17f4-4f5e-ba4d-04d9507475e3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aadfba98-c569-476a-9d73-8487ebffa2d4"], "isController": false}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.02631578947368421, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=65f20961-ff02-413d-b5a5-0eab88db709d"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=04189d7d-6b17-4274-b185-7cdd78c2db2a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6d247171-76d8-468b-b249-ed0aedbbd130"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/43d6ff8e-1746-4a67-8db8-2a9baf3925ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3deabc1c-f07e-407e-8359-e057858fba45"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "register"], "isController": true}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e1181b9-17f4-4f5e-ba4d-04d9507475e3"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/91a81b5b-469d-4327-89a4-5437ebb5c0af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3416666666666667, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8212486a-c90e-41c1-9337-5a852f5b03de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3cfe7172-1dcc-473b-8780-e65f2fa87694"], "isController": false}, {"data": [0.34210526315789475, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3220338983050847, 500, 1500, "addBook"], "isController": true}, {"data": [0.9833333333333333, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.49166666666666664, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49166666666666664, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9606741573033708, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=12e423ef-0398-45ff-816f-03fef82273db"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/aadfba98-c569-476a-9d73-8487ebffa2d4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/65f20961-ff02-413d-b5a5-0eab88db709d"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8212486a-c90e-41c1-9337-5a852f5b03de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=43d6ff8e-1746-4a67-8db8-2a9baf3925ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6d247171-76d8-468b-b249-ed0aedbbd130"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/04189d7d-6b17-4274-b185-7cdd78c2db2a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1337, 16, 1.1967090501121915, 385.6836200448771, 112, 2933, 126.0, 1051.0000000000002, 1298.7999999999956, 1820.4799999999996, 5.189572723885232, 727.8061737526782, 3.805129961291687], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 60, 0, 0.0, 1871.9333333333336, 1384, 2554, 1846.5, 2290.2, 2397.85, 2554.0, 0.25337195848078176, 304.8925151943996, 1.2458279403815782], "isController": true}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 571.3076923076924, 117, 1451, 467.0, 1243.3999999999999, 1451.0, 1451.0, 0.07247629188990294, 0.013730859986954268, 0.04899445242767703], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 571.3076923076924, 117, 1451, 467.0, 1243.3999999999999, 1451.0, 1451.0, 0.0730924281866893, 0.013847588933806372, 0.049410964637320996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 22, 0, 0.0, 145.22727272727272, 113, 340, 115.0, 338.7, 339.85, 340.0, 0.10440840772432383, 0.035065430257556554, 0.059146843899938774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 22, 0, 0.0, 126.18181818181814, 114, 343, 115.5, 120.8, 309.84999999999957, 343.0, 0.1044079122214207, 0.07759220820361441, 0.05240787781426782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 22, 0, 0.0, 233.31818181818184, 113, 903, 116.0, 345.0, 819.2999999999988, 903.0, 0.10440890323193015, 1.4223024981016563, 0.06107512991789663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 22, 0, 0.0, 186.2272727272727, 112, 1004, 115.0, 343.1, 904.9999999999986, 1004.0, 0.10440890323193015, 4.297194789343173, 0.0609731680983342], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3cfe7172-1dcc-473b-8780-e65f2fa87694", 3, 0, 0.0, 533.0, 206, 929, 464.0, 929.0, 929.0, 929.0, 0.036486141347311575, 0.03041699478856281, 0.02339768829889447], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54023440-535f-4abd-9d94-e3f1fb7aaad2", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 1.5206473214285714, 2.8413318452380953], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/03985843-e3ae-43bb-9a04-da1fa2f85e4c", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 204.0, 4.901960784313726, 1.5653722426470589, 2.924900428921569], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 231.84615384615384, 118, 437, 215.0, 370.99999999999994, 437.0, 437.0, 0.07272117025144743, 0.1642016928649344, 0.04700763747098146], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f67e30a9-e229-4a55-ad4a-62d65f58b5e4", 2, 0, 0.0, 239.0, 206, 272, 239.0, 272.0, 272.0, 272.0, 0.01113622949541744, 0.022022328836152655, 0.006922080150227736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=91a81b5b-469d-4327-89a4-5437ebb5c0af", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 0.7993985066371682, 3.0506775442477876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 116.64705882352939, 114, 126, 116.0, 118.8, 126.0, 126.0, 0.08501870411490528, 0.06318284553851848, 0.042675404213927064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 129.76470588235293, 114, 342, 116.0, 169.99999999999983, 342.0, 342.0, 0.08501955449753443, 0.030260866249237323, 0.048067696195124875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 957.75, 684, 1132, 1007.5, 1132.0, 1132.0, 1132.0, 0.09433962264150943, 27.738981426886795, 0.05380306603773585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1173.0, 943, 1373, 1188.0, 1373.0, 1373.0, 1373.0, 0.09363076707005923, 84.24912879497204, 0.0533073605486763], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 172.75, 114, 348, 114.5, 348.0, 348.0, 348.0, 0.09647387969707202, 0.17071354493270946, 0.05341864237132796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/12e423ef-0398-45ff-816f-03fef82273db", 3, 0, 0.0, 1157.0, 266, 2933, 272.0, 2933.0, 2933.0, 2933.0, 0.01712094233666621, 0.02360260117050176, 0.01097925013126056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 115.4, 114, 117, 115.0, 117.0, 117.0, 117.0, 0.07162434463724657, 0.05322863893451625, 0.035952063616742906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 145.26666666666668, 113, 349, 115.0, 343.6, 349.0, 349.0, 0.07162468664199594, 0.01916519935537782, 0.040848454100513305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 130.46666666666667, 113, 344, 115.0, 210.20000000000007, 344.0, 344.0, 0.07162502865001145, 0.0193051835033234, 0.04210768285869814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 175.73333333333335, 112, 345, 115.0, 343.8, 345.0, 345.0, 0.07162434463724657, 0.019304999140507866, 0.0421772263830661], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 172.25, 114, 342, 116.5, 342.0, 342.0, 342.0, 0.09647155295082363, 0.07169419120661795, 0.05417103803390975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 882.7333333333333, 113, 1582, 1026.0, 1451.8000000000002, 1582.0, 1582.0, 0.07779276008712789, 46.67236404094493, 0.04127675746810497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 222.76470588235293, 114, 1246, 116.0, 525.9999999999993, 1246.0, 1246.0, 0.08501912930409343, 4.521588646507964, 0.04955216486209397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 661.8666666666667, 114, 1030, 896.0, 1025.8, 1030.0, 1030.0, 0.07788485503032316, 15.27415306710559, 0.0414016823777727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 176.11764705882354, 113, 906, 115.0, 455.59999999999957, 906.0, 906.0, 0.08501955449753443, 1.492071692114186, 0.049635439588605376], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/27276ab0-8be4-4cbc-9da9-4558abc124c7", 3, 0, 0.0, 303.0, 218, 459, 232.0, 459.0, 459.0, 459.0, 0.01860511268496583, 0.021990613333043918, 0.011931013017377175], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 439.50000000000006, 119, 889, 432.0, 796.0000000000003, 889.0, 889.0, 0.07447448938428215, 0.014163971491786085, 0.050904234728075023], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 293.20000000000005, 229, 466, 232.0, 463.0, 466.0, 466.0, 0.07158469423790935, 0.11094229468316615, 0.16099565510732933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=27276ab0-8be4-4cbc-9da9-4558abc124c7", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 0.3528594970703125, 1.346588134765625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e1181b9-17f4-4f5e-ba4d-04d9507475e3", 3, 0, 0.0, 342.3333333333333, 210, 546, 271.0, 546.0, 546.0, 546.0, 0.054747522674598974, 0.024771828293519718, 0.035108274631822915], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aadfba98-c569-476a-9d73-8487ebffa2d4", 1, 0, 0.0, 889.0, 889, 889, 889.0, 889.0, 889.0, 889.0, 1.124859392575928, 0.2032216676040495, 0.7755378233970753], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 435.78947368421046, 129, 972, 372.0, 906.0, 972.0, 972.0, 0.07794072402830479, 0.04787569864629269, 0.035240776587016714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 146.26666666666665, 113, 349, 116.0, 344.2, 349.0, 349.0, 0.0778828330659356, 0.057879722620290036, 0.039093531441299706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 206.6666666666667, 114, 348, 117.0, 347.4, 348.0, 348.0, 0.0777923566416521, 0.09870918170220049, 0.04001039176230805], "isController": false}, {"data": ["login", 19, 0, 0.0, 2499.9473684210525, 1318, 5289, 2475.0, 3327.0, 5289.0, 5289.0, 0.08115392336506878, 20.551955796205416, 0.1507746128637511], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 120.41176470588233, 115, 137, 120.0, 126.6, 137.0, 137.0, 0.08342903133987024, 0.06754166697339105, 0.0296564134840945], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=65f20961-ff02-413d-b5a5-0eab88db709d", 1, 0, 0.0, 386.0, 386, 386, 386.0, 386.0, 386.0, 386.0, 2.5906735751295336, 0.4680416126943005, 1.7861479922279793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1030.9333333333334, 229, 1698, 1146.0, 1569.0, 1698.0, 1698.0, 0.07774477943806073, 62.046686185465354, 0.16158867731510995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=04189d7d-6b17-4274-b185-7cdd78c2db2a", 1, 0, 0.0, 560.0, 560, 560, 560.0, 560.0, 560.0, 560.0, 1.7857142857142856, 0.32261439732142855, 1.231166294642857], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d247171-76d8-468b-b249-ed0aedbbd130", 3, 0, 0.0, 967.3333333333334, 230, 1988, 684.0, 1988.0, 1988.0, 1988.0, 0.04204330460374185, 0.026646586609207483, 0.02696136395487352], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/43d6ff8e-1746-4a67-8db8-2a9baf3925ce", 3, 0, 0.0, 332.0, 209, 437, 350.0, 437.0, 437.0, 437.0, 0.01917030902538149, 0.022658656273164126, 0.012293459889323417], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3deabc1c-f07e-407e-8359-e057858fba45", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 1.46484375, 2.7370627866972477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 22, 0, 0.0, 375.5909090909091, 231, 1120, 234.0, 617.9999999999998, 1054.599999999999, 1120.0, 0.10435096074032264, 5.828919230874129, 0.23347415772173394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 935.8333333333334, 115, 1599, 1147.5, 1599.0, 1599.0, 1599.0, 0.09257116408238833, 73.83978679703773, 0.1596038966674381], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1083.4090909090908, 136, 2310, 1030.0, 2208.9, 2301.9, 2310.0, 0.08921113030502097, 0.028068558753639408, 0.04024955293058563], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 367.64705882352933, 230, 1361, 236.0, 641.7999999999994, 1361.0, 1361.0, 0.0849689863199932, 6.103494880618574, 0.1898184115922688], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 147.47058823529412, 117, 350, 120.0, 349.2, 350.0, 350.0, 0.0942334661840435, 0.07315977110968222, 0.03349705243260922], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e1181b9-17f4-4f5e-ba4d-04d9507475e3", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 0.7590926995798319, 2.8968618697478994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 468.75000000000006, 231, 1467, 459.5, 916.8000000000005, 1467.0, 1467.0, 0.15392311540385578, 11.732738740163352, 0.34371527710970873], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/91a81b5b-469d-4327-89a4-5437ebb5c0af", 3, 0, 0.0, 352.3333333333333, 215, 432, 410.0, 432.0, 432.0, 432.0, 0.07868233319345362, 0.036472539865715484, 0.05045709517939572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 116.25, 113, 125, 116.0, 122.60000000000001, 125.0, 125.0, 0.05183898810295223, 0.03852487299447915, 0.026020742075114695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 171.33333333333331, 113, 342, 115.5, 342.0, 342.0, 342.0, 0.05178909753181792, 0.013857629613005969, 0.02953596968611491], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 172.00000000000003, 113, 343, 116.0, 342.1, 343.0, 343.0, 0.05183988387866011, 0.013972468701670107, 0.030476181733352918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 171.66666666666669, 114, 342, 115.0, 342.0, 342.0, 342.0, 0.05178932104200114, 0.01395884043710187, 0.03049703182453778], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 119.0, 119, 119, 119.0, 119.0, 119.0, 119.0, 8.403361344537815, 2.4783350840336134, 5.194655987394958], "isController": false}, {"data": ["https://demoqa.com/books", 60, 0, 0.0, 1304.0999999999997, 901, 2070, 1173.5, 1817.4, 1923.6999999999998, 2070.0, 0.2525263153464451, 302.10926550616796, 0.4986408297172968], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1083.4090909090908, 136, 2310, 1030.0, 2208.9, 2301.9, 2310.0, 0.08760019272042399, 0.027561708363031127, 0.03952274320003504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 159.8, 114, 338, 116.0, 338.0, 338.0, 338.0, 0.025687658621291985, 0.006923626737770106, 0.015126619285780341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 160.2, 113, 343, 114.0, 343.0, 343.0, 343.0, 0.025687658621291985, 0.006923626737770106, 0.015101533681657986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 182.29411764705884, 113, 1013, 115.0, 475.3999999999995, 1013.0, 1013.0, 0.095598531156686, 5.08423500262896, 0.05571821559718153], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 202.64705882352942, 114, 891, 118.0, 451.7999999999996, 891.0, 891.0, 0.095598531156686, 1.677730058568159, 0.05581157353776423], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 114.0, 112, 116, 114.0, 116.0, 116.0, 116.0, 0.025687526650808902, 0.006873420217110976, 0.014649917543039452], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 115.88235294117648, 113, 124, 115.0, 119.19999999999999, 124.0, 124.0, 0.09559691840521846, 0.07104419424450317, 0.04798517193386942], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 176.8, 114, 422, 116.0, 422.0, 422.0, 422.0, 0.025687394681681804, 0.019089948586679544, 0.012893868033578563], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 142.76470588235293, 113, 343, 116.0, 339.8, 343.0, 343.0, 0.095598531156686, 0.03402622352061273, 0.054048755953820284], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 119.0, 117, 123, 118.0, 123.0, 123.0, 123.0, 0.026515493002561397, 0.020870593125062977, 0.009425429153254247], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 667.1666666666666, 115, 2933, 452.5, 2264.9000000000024, 2933.0, 2933.0, 0.07493677209854185, 0.014081136619102633, 0.05100066935710495], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8212486a-c90e-41c1-9337-5a852f5b03de", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.44608410493827155, 1.7023533950617282], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3cfe7172-1dcc-473b-8780-e65f2fa87694", 1, 0, 0.0, 496.0, 496, 496, 496.0, 496.0, 496.0, 496.0, 2.0161290322580645, 0.3642420614919355, 1.3900264616935485], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1403.8421052631581, 909, 2395, 1294.0, 2105.0, 2395.0, 2395.0, 0.0805234874298598, 0.04167719564240791, 0.03703765876900778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 338.6, 229, 765, 233.0, 765.0, 765.0, 765.0, 0.025672095459119755, 0.03978673388049126, 0.05773714437729765], "isController": false}, {"data": ["addBook", 59, 6, 10.169491525423728, 1119.8644067796613, 577, 2707, 932.0, 1871.0, 1951.0, 2707.0, 0.2670553302433372, 76.82582373414643, 0.9730307003299717], "isController": true}, {"data": ["https://demoqa.com/books-0", 60, 0, 0.0, 217.7833333333334, 113, 606, 117.0, 462.8, 473.75, 606.0, 0.25350363143952037, 0.1883947885990967, 0.12254325933844003], "isController": false}, {"data": ["https://demoqa.com/books-3", 60, 0, 0.0, 751.0833333333336, 563, 1554, 682.5, 914.9, 1016.95, 1554.0, 0.25307272466531133, 74.41178385691268, 0.12727778633069856], "isController": false}, {"data": ["https://demoqa.com/books-1", 60, 0, 0.0, 178.70000000000002, 113, 469, 117.0, 346.9, 352.9, 469.0, 0.2539252613314148, 0.44932868509035506, 0.12349099623344197], "isController": false}, {"data": ["https://demoqa.com/books-2", 60, 0, 0.0, 1079.2666666666662, 784, 1606, 1052.5, 1413.3, 1467.85, 1606.0, 0.2530791294077948, 227.72104550679094, 0.127033859878522], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 124.0, 115, 150, 119.5, 141.60000000000002, 150.0, 150.0, 0.14663025348705072, 0.1095431092945252, 0.05212247291922506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 6, 3.3707865168539324, 177.8258426966292, 114, 2015, 120.0, 277.0, 346.69999999999976, 789.7100000000123, 0.7279984949244599, 1.5820403563716228, 0.3482947504355721], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 119.08333333333333, 116, 125, 118.5, 124.10000000000001, 125.0, 125.0, 0.05247163252366689, 0.040634770108660005, 0.018652025623647216], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=12e423ef-0398-45ff-816f-03fef82273db", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 22, 0, 0.0, 130.36363636363637, 114, 361, 118.0, 129.4, 326.3499999999995, 361.0, 0.1060189870367693, 0.08603689280034697, 0.03768643679822659], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 327.3333333333333, 230, 467, 235.0, 464.6, 467.0, 467.0, 0.05176251358765982, 0.08022178619493762, 0.11641510624255914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aadfba98-c569-476a-9d73-8487ebffa2d4", 3, 0, 0.0, 676.6666666666666, 200, 1124, 706.0, 1124.0, 1124.0, 1124.0, 0.022988858066790293, 0.023056208236907846, 0.0147422039035081], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/65f20961-ff02-413d-b5a5-0eab88db709d", 3, 0, 0.0, 272.0, 205, 404, 207.0, 404.0, 404.0, 404.0, 0.026636833413243834, 0.026714871011134195, 0.017081563093779412], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 339.4117647058824, 231, 1128, 238.0, 592.7999999999995, 1128.0, 1128.0, 0.09553513726151339, 6.862482965242069, 0.21342290630531907], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8212486a-c90e-41c1-9337-5a852f5b03de", 3, 0, 0.0, 379.6666666666667, 300, 437, 402.0, 437.0, 437.0, 437.0, 0.02627821623468199, 0.031059961962282, 0.016851590489037605], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=43d6ff8e-1746-4a67-8db8-2a9baf3925ce", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 119.53333333333335, 115, 137, 117.0, 134.0, 137.0, 137.0, 0.07197593124859047, 0.05967535706059894, 0.025585194311022394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6d247171-76d8-468b-b249-ed0aedbbd130", 1, 0, 0.0, 579.0, 579, 579, 579.0, 579.0, 579.0, 579.0, 1.7271157167530224, 0.31202774179620035, 1.1907653281519863], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 133.33333333333334, 116, 342, 118.0, 211.20000000000007, 342.0, 342.0, 0.07662952688930098, 0.059492650270502226, 0.02723940213643121], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 147.5625, 115, 343, 116.0, 340.9, 343.0, 343.0, 0.15443419173004902, 0.11476994131500715, 0.07751872514574727], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/04189d7d-6b17-4274-b185-7cdd78c2db2a", 3, 0, 0.0, 298.3333333333333, 222, 446, 227.0, 446.0, 446.0, 446.0, 0.02731817478168225, 0.027398208496862964, 0.017518490989555352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 214.25000000000003, 113, 344, 116.0, 344.0, 344.0, 344.0, 0.1540965607573846, 0.05569823198274118, 0.08707433834789224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 263.25000000000006, 113, 1123, 120.0, 577.0000000000006, 1123.0, 1123.0, 0.15443717302754773, 8.724201526635586, 0.08996266963958224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 249.68750000000003, 114, 902, 119.5, 510.7000000000004, 902.0, 902.0, 0.15409804488105558, 2.8708097069729366, 0.08991560724260811], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 37.5, 0.4487658937920718], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.25, 0.07479431563201197], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.25, 0.07479431563201197], "isController": false}, {"data": ["401/Unauthorized", 8, 50.0, 0.5983545250560958], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1337, 16, "401/Unauthorized", 8, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
