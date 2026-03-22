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

    var data = {"OkPercent": 98.3679525222552, "KoPercent": 1.632047477744807};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8361022364217252, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dbc5ec6c-704a-473a-9b41-7c5d7077364b"], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a31fc0c3-185d-4566-9131-8c5b935878a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f8659b1a-77be-41f8-b518-82af10b57e75"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/891c68a5-a9de-401f-97e6-e0939e3385b1"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/67eeea16-4faa-4128-9cb2-d0994544cd1e"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/189f725c-470b-4fda-b7a5-0773dbfd5b26"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b6f0279b-a635-424b-af9f-3f15f35da8a1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=189f725c-470b-4fda-b7a5-0773dbfd5b26"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/35b273f4-163c-4af1-bf61-ad371395ba3f"], "isController": false}, {"data": [0.8695652173913043, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.06521739130434782, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=99faf4df-bb0b-4f68-b74f-c648b9a5c260"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8d928814-f6ea-4514-b05f-6cdbec602db8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7c6b4a4a-eafa-4d51-be4c-1741281caa55"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f8659b1a-77be-41f8-b518-82af10b57e75"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/746c71d8-e5a2-4f05-a183-b79aee97cec2"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a31fc0c3-185d-4566-9131-8c5b935878a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/153e751f-3be5-4323-8b18-07c13baefa87"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1afe9249-0e20-4210-8470-ebebb6df4002"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2918ce89-e0d4-4571-a8c0-c0fd3fac3281"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=67eeea16-4faa-4128-9cb2-d0994544cd1e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.43478260869565216, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/734f99f9-7971-4727-9c71-3e9a114c4a7c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b6f0279b-a635-424b-af9f-3f15f35da8a1"], "isController": false}, {"data": [0.4112903225806452, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dbc5ec6c-704a-473a-9b41-7c5d7077364b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35b273f4-163c-4af1-bf61-ad371395ba3f"], "isController": false}, {"data": [0.8596491228070176, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9281767955801105, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7c6b4a4a-eafa-4d51-be4c-1741281caa55"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8d928814-f6ea-4514-b05f-6cdbec602db8"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2918ce89-e0d4-4571-a8c0-c0fd3fac3281"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/99faf4df-bb0b-4f68-b74f-c648b9a5c260"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ec21fd43-3a74-4072-b22d-0e9999a9ac8f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=746c71d8-e5a2-4f05-a183-b79aee97cec2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1348, 22, 1.632047477744807, 261.41543026706233, 77, 1797, 101.5, 632.0, 790.0, 1216.7499999999998, 5.271143228066883, 751.9067354936027, 3.850126640144761], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dbc5ec6c-704a-473a-9b41-7c5d7077364b", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 0.9872353142076503, 3.7675034153005464], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1155.8596491228075, 943, 1664, 1136.0, 1392.0000000000002, 1442.4999999999998, 1664.0, 0.2460544945954346, 296.085554085314, 1.209848027625013], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a31fc0c3-185d-4566-9131-8c5b935878a2", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f8659b1a-77be-41f8-b518-82af10b57e75", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.3936036220043573, 1.502076525054466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/891c68a5-a9de-401f-97e6-e0939e3385b1", 1, 0, 0.0, 166.0, 166, 166, 166.0, 166.0, 166.0, 166.0, 6.024096385542169, 1.9237104668674698, 3.5944559487951806], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 439.99999999999994, 82, 748, 422.0, 742.4, 748.0, 748.0, 0.09337403483569762, 0.017690002693481775, 0.06312146480517149], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 439.99999999999994, 82, 748, 422.0, 742.4, 748.0, 748.0, 0.09566701989874014, 0.0181244158792535, 0.06467153786574237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 100.46666666666668, 77, 235, 80.0, 234.4, 235.0, 235.0, 0.10533042153234698, 0.02818411669908503, 0.060071256030166637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 90.2, 78, 234, 80.0, 144.00000000000006, 234.0, 234.0, 0.10533042153234698, 0.07827778397081646, 0.052870934245728855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 110.6, 78, 236, 80.0, 235.4, 236.0, 236.0, 0.10533042153234698, 0.028389840178640397, 0.062025629085942606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 142.20000000000002, 78, 241, 80.0, 239.2, 241.0, 241.0, 0.10533116117072075, 0.02839003953429583, 0.061923202172630754], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 198.76923076923077, 79, 258, 213.0, 250.0, 258.0, 258.0, 0.09280874972335854, 0.1945205022559665, 0.05999243474830981], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 103.54999999999998, 78, 239, 80.0, 235.8, 238.85, 239.0, 0.11416763233455683, 0.08484528145175561, 0.05730679982418184], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 470.33333333333337, 391, 550, 470.5, 550.0, 550.0, 550.0, 0.029415513741947504, 8.64913772711228, 0.016776035180954437], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 103.09999999999998, 77, 241, 80.0, 237.5, 240.85, 241.0, 0.11406605565282855, 0.056219861609357984, 0.06361633240559608], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 619.5, 543, 703, 617.5, 703.0, 703.0, 703.0, 0.02939519388579967, 26.449847129681796, 0.016735740268966022], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 134.0, 79, 244, 83.0, 244.0, 244.0, 244.0, 0.029483449956757606, 0.052171886056293734, 0.01632530871629059], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 80.14285714285714, 78, 85, 80.0, 83.5, 85.0, 85.0, 0.06241751970610265, 0.04638645751596105, 0.03133066907122731], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 113.57142857142857, 77, 239, 80.0, 237.5, 239.0, 239.0, 0.06237580531620078, 0.02338222501180685, 0.0351995162533527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67eeea16-4faa-4128-9cb2-d0994544cd1e", 3, 0, 0.0, 252.66666666666669, 166, 406, 186.0, 406.0, 406.0, 406.0, 0.059242876044155686, 0.026805858626750133, 0.03799103704654515], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/189f725c-470b-4fda-b7a5-0773dbfd5b26", 3, 0, 0.0, 763.0, 238, 1695, 356.0, 1695.0, 1695.0, 1695.0, 0.018306747867263874, 0.02523732982352295, 0.011739678808108668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 157.78571428571428, 78, 704, 80.0, 470.0, 704.0, 704.0, 0.06224601403203001, 4.016226931460469, 0.036211757605129076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 157.5714285714286, 78, 386, 81.0, 312.5, 386.0, 386.0, 0.06233414664553242, 1.3247658434477907, 0.036323902139842205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b6f0279b-a635-424b-af9f-3f15f35da8a1", 3, 0, 0.0, 247.33333333333334, 167, 367, 208.0, 367.0, 367.0, 367.0, 0.027389756231169543, 0.027469999657628048, 0.017564394458139322], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 105.66666666666666, 79, 235, 80.0, 235.0, 235.0, 235.0, 0.029483015326254133, 0.021910717444608784, 0.016555404113863404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 22, 0, 0.0, 327.63636363636374, 78, 707, 234.0, 706.4, 707.0, 707.0, 0.12208182811988437, 44.95785250607635, 0.0674788229647017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 196.85, 79, 702, 80.0, 701.0, 701.95, 702.0, 0.11406475456116437, 15.421482412284204, 0.06558723387266951], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 22, 0, 0.0, 266.0909090909092, 78, 609, 158.0, 545.7, 599.5499999999998, 609.0, 0.12208250557695083, 14.704298049870705, 0.06759841861536242], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 165.64999999999998, 77, 559, 80.0, 535.5000000000003, 558.65, 559.0, 0.11417023924373634, 5.061632752159245, 0.06575938193940986], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 432.15384615384613, 86, 1108, 405.0, 960.3999999999999, 1108.0, 1108.0, 0.09590415486307836, 0.018169341839294147, 0.06559550255621459], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=189f725c-470b-4fda-b7a5-0773dbfd5b26", 1, 0, 0.0, 739.0, 739, 739, 739.0, 739.0, 739.0, 739.0, 1.3531799729364007, 0.2444709912043302, 0.9329541610284168], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 272.7857142857143, 158, 784, 240.5, 552.0, 784.0, 784.0, 0.06222194568024142, 5.406620935851396, 0.13880146643792693], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/35b273f4-163c-4af1-bf61-ad371395ba3f", 3, 0, 0.0, 393.0, 233, 604, 342.0, 604.0, 604.0, 604.0, 0.03865182436611008, 0.03876506213280767, 0.02478648893269429], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 395.30434782608694, 136, 843, 337.0, 787.8000000000001, 836.5999999999999, 843.0, 0.10804868767822161, 0.06636975053672012, 0.04885404530763341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 22, 0, 0.0, 90.04545454545456, 79, 256, 82.0, 87.0, 230.64999999999964, 256.0, 0.12208182811988437, 0.090726827343, 0.06127935513048883], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 22, 0, 0.0, 156.04545454545453, 78, 325, 82.5, 246.2, 313.4499999999998, 325.0, 0.1220811506703365, 0.10767722229312794, 0.06543003432145077], "isController": false}, {"data": ["login", 23, 0, 0.0, 1992.6521739130433, 1117, 2814, 1989.0, 2673.8, 2786.5999999999995, 2814.0, 0.1061904410135185, 33.28630270277757, 0.2061542771085728], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 84.15, 80, 95, 83.0, 90.60000000000001, 94.8, 95.0, 0.10789989048161115, 0.08735254805591372, 0.03835503919463522], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=99faf4df-bb0b-4f68-b74f-c648b9a5c260", 1, 0, 0.0, 1108.0, 1108, 1108, 1108.0, 1108.0, 1108.0, 1108.0, 0.9025270758122744, 0.16305420803249096, 0.6222501128158844], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8d928814-f6ea-4514-b05f-6cdbec602db8", 3, 0, 0.0, 312.3333333333333, 233, 364, 340.0, 364.0, 364.0, 364.0, 0.021300615587790485, 0.025176606510178143, 0.013659574449201581], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7c6b4a4a-eafa-4d51-be4c-1741281caa55", 3, 0, 0.0, 317.6666666666667, 200, 495, 258.0, 495.0, 495.0, 495.0, 0.05408328826392644, 0.03540413173787633, 0.03468231701820804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 22, 0, 0.0, 426.49999999999994, 162, 794, 319.0, 789.7, 793.4, 794.0, 0.122024948555391, 59.83258380722, 0.2616646490950741], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f8659b1a-77be-41f8-b518-82af10b57e75", 3, 0, 0.0, 271.6666666666667, 171, 421, 223.0, 421.0, 421.0, 421.0, 0.059646890408780025, 0.03904619030340385, 0.03825012177906792], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/746c71d8-e5a2-4f05-a183-b79aee97cec2", 3, 0, 0.0, 289.3333333333333, 177, 411, 280.0, 411.0, 411.0, 411.0, 0.07496439191384092, 0.033919435143306934, 0.04807286851245658], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 564.75, 79, 925, 628.5, 925.0, 925.0, 925.0, 0.03917785275983487, 35.155370028697774, 0.07274588846799904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 244.0, 159, 470, 164.0, 380.6, 470.0, 470.0, 0.10527128409912345, 0.16314992955596572, 0.23675758523464968], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a31fc0c3-185d-4566-9131-8c5b935878a2", 3, 0, 0.0, 278.3333333333333, 213, 373, 249.0, 373.0, 373.0, 373.0, 0.030163486094632912, 0.030251855682800782, 0.019343120965633735], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/153e751f-3be5-4323-8b18-07c13baefa87", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 1.804157838983051, 3.3710716807909606], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 905.4782608695652, 136, 1797, 948.0, 1549.6000000000004, 1761.9999999999995, 1797.0, 0.10717614165890027, 0.033765581314072694, 0.04835486078751165], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1afe9249-0e20-4210-8470-ebebb6df4002", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 0.9364690249266862, 1.7497938049853372], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 11, 0, 0.0, 87.54545454545455, 80, 101, 85.0, 101.0, 101.0, 101.0, 0.07033382993279923, 0.05460487773103065, 0.025001478608924724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 324.85, 160, 936, 165.0, 784.6, 928.4499999999999, 936.0, 0.1140114353469653, 20.609788157845983, 0.2520387560497318], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 276.61904761904765, 160, 786, 316.0, 443.60000000000014, 754.7999999999995, 786.0, 0.11096961017961224, 6.485612261613498, 0.24822122485349368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 80.55555555555556, 80, 81, 81.0, 81.0, 81.0, 81.0, 0.053769864977894606, 0.03995983129704863, 0.026989951756482257], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 114.22222222222223, 78, 235, 80.0, 235.0, 235.0, 235.0, 0.05372140081537148, 0.02333989679521999, 0.030136679927893942], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 148.33333333333334, 78, 684, 81.0, 684.0, 684.0, 684.0, 0.05377082872796143, 5.388781061988803, 0.031097929375003733], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2918ce89-e0d4-4571-a8c0-c0fd3fac3281", 3, 0, 0.0, 512.0, 188, 991, 357.0, 991.0, 991.0, 991.0, 0.020102926986169185, 0.02771350774297738, 0.01289152544360459], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 132.33333333333334, 77, 389, 80.0, 389.0, 389.0, 389.0, 0.05377050747410054, 1.7695841336675073, 0.031150253841604036], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 86.0, 86, 86, 86.0, 86.0, 86.0, 86.0, 11.627906976744185, 3.429324127906977, 7.18795421511628], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 752.2456140350878, 618, 1123, 634.0, 1024.4, 1042.4999999999995, 1123.0, 0.24623944842363554, 294.5879869979091, 0.4862267233521397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 905.4782608695652, 136, 1797, 948.0, 1549.6000000000004, 1761.9999999999995, 1797.0, 0.10671120699654349, 0.03361910478576565, 0.04814509534414364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 102.42857142857143, 79, 235, 81.0, 235.0, 235.0, 235.0, 0.03184742354343534, 0.008583875876941555, 0.01875390273114405], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=67eeea16-4faa-4128-9cb2-d0994544cd1e", 1, 0, 0.0, 335.0, 335, 335, 335.0, 335.0, 335.0, 335.0, 2.985074626865672, 0.5392957089552238, 2.058069029850746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 125.0, 79, 238, 81.0, 238.0, 238.0, 238.0, 0.03182440204221734, 0.008577670862941393, 0.01870926760685043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 11, 0, 0.0, 209.0, 79, 708, 80.0, 673.0000000000001, 708.0, 708.0, 0.07032933308611507, 11.521410786441782, 0.04024705975435882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 11, 0, 0.0, 167.72727272727272, 78, 549, 81.0, 517.6000000000001, 549.0, 549.0, 0.07032213932733677, 3.7749703528253518, 0.04031161697768231], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 124.85714285714286, 79, 237, 81.0, 237.0, 237.0, 237.0, 0.03184756843814975, 0.008521712648489287, 0.018163066374882277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 11, 0, 0.0, 82.54545454545455, 78, 104, 80.0, 99.80000000000001, 104.0, 104.0, 0.07053361888762072, 0.052418050755350935, 0.035404570418200235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 81.42857142857142, 79, 86, 81.0, 86.0, 86.0, 86.0, 0.0318468439777618, 0.023667429948317123, 0.015985622856024968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 11, 0, 0.0, 122.36363636363637, 78, 239, 80.0, 238.8, 239.0, 239.0, 0.07053271435533098, 0.03813425341121855, 0.03914866212264998], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 87.28571428571429, 82, 102, 83.0, 102.0, 102.0, 102.0, 0.03276463291909476, 0.0257893497390531, 0.011646803107959465], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 385.3846153846154, 79, 604, 373.0, 560.4, 604.0, 604.0, 0.09176837661741764, 0.017192783299567277, 0.062456542379342235], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1135.521739130435, 640, 1677, 1078.0, 1622.2000000000003, 1675.0, 1677.0, 0.10637313847007678, 0.055056409559707704, 0.04892748849551383], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 230.14285714285714, 163, 318, 168.0, 318.0, 318.0, 318.0, 0.03181239774586439, 0.049303003147155064, 0.07154682813352119], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/734f99f9-7971-4727-9c71-3e9a114c4a7c", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 1.400596217105263, 2.617016173245614], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b6f0279b-a635-424b-af9f-3f15f35da8a1", 1, 0, 0.0, 531.0, 531, 531, 531.0, 531.0, 531.0, 531.0, 1.8832391713747645, 0.34023363935969864, 1.298405131826742], "isController": false}, {"data": ["addBook", 62, 12, 19.35483870967742, 790.2258064516128, 404, 1464, 677.0, 1296.8, 1395.0499999999997, 1464.0, 0.28981578000177627, 96.19698226397543, 1.0517827687573915], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/dbc5ec6c-704a-473a-9b41-7c5d7077364b", 3, 0, 0.0, 249.0, 164, 370, 213.0, 370.0, 370.0, 370.0, 0.07792207792207792, 0.03525771103896104, 0.04996956168831169], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 151.52631578947367, 79, 340, 82.0, 321.0, 324.2, 340.0, 0.2468248366409305, 0.18343134832397276, 0.11931474036841855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35b273f4-163c-4af1-bf61-ad371395ba3f", 1, 0, 0.0, 388.0, 388, 388, 388.0, 388.0, 388.0, 388.0, 2.577319587628866, 0.46562902706185566, 1.7769410438144329], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 442.0701754385966, 386, 648, 393.0, 552.0, 584.7999999999997, 648.0, 0.24681308022724122, 72.57124055236335, 0.12412962530959887], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 138.80701754385964, 78, 347, 86.0, 241.2, 255.09999999999948, 347.0, 0.24714268370939488, 0.4373267020326402, 0.12019243797585806], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 596.5263157894736, 536, 809, 549.0, 710.4, 779.8999999999999, 809.0, 0.24664220437551926, 221.9290890478421, 0.12380282524318055], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 92.42857142857143, 80, 243, 83.0, 98.4, 228.6999999999998, 243.0, 0.109109046698672, 0.08151212961375398, 0.03878485644366856], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 12, 6.629834254143646, 138.4143646408839, 79, 817, 87.0, 247.8, 303.9000000000002, 577.560000000002, 0.7420404883528341, 1.5896595210251638, 0.35723590046203296], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 83.88888888888889, 79, 89, 83.0, 89.0, 89.0, 89.0, 0.05386995792157732, 0.04171765296075275, 0.019149086604935688], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 93.93333333333334, 81, 243, 83.0, 151.20000000000005, 243.0, 243.0, 0.10062589305480087, 0.08166027063333936, 0.03576936042182374], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7c6b4a4a-eafa-4d51-be4c-1741281caa55", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8d928814-f6ea-4514-b05f-6cdbec602db8", 1, 0, 0.0, 365.0, 365, 365, 365.0, 365.0, 365.0, 365.0, 2.73972602739726, 0.4949700342465754, 1.8889126712328768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 263.77777777777777, 160, 766, 164.0, 766.0, 766.0, 766.0, 0.05369543946734124, 7.211572523148701, 0.11923580389530583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 11, 0, 0.0, 308.6363636363636, 160, 790, 189.0, 757.6000000000001, 790.0, 790.0, 0.07028619259694703, 15.377619308815168, 0.15480558879063022], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2918ce89-e0d4-4571-a8c0-c0fd3fac3281", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.44608410493827155, 1.7023533950617282], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/99faf4df-bb0b-4f68-b74f-c648b9a5c260", 3, 0, 0.0, 321.0, 155, 431, 377.0, 431.0, 431.0, 431.0, 0.016483788194310896, 0.022724232748342003, 0.010570658444919421], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 84.28571428571429, 81, 95, 83.0, 92.5, 95.0, 95.0, 0.062325544124259336, 0.051674206017086104, 0.022154783262920308], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 22, 0, 0.0, 84.40909090909089, 80, 97, 82.5, 91.1, 96.24999999999999, 97.0, 0.12393318874461312, 0.09621766118356195, 0.0440543756865617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ec21fd43-3a74-4072-b22d-0e9999a9ac8f", 1, 0, 0.0, 164.0, 164, 164, 164.0, 164.0, 164.0, 164.0, 6.097560975609756, 1.947170350609756, 3.6382907774390243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 90.76190476190476, 78, 237, 81.0, 125.60000000000004, 226.89999999999986, 237.0, 0.1113857447463057, 0.08277788257025258, 0.055910422655860485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 146.33333333333337, 78, 238, 82.0, 236.6, 237.9, 238.0, 0.11129719531067817, 0.037740845805685694, 0.0630290757297916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 169.80952380952382, 78, 707, 82.0, 238.8, 660.1999999999994, 707.0, 0.11101888907098337, 4.785402511207621, 0.06481264571229191], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=746c71d8-e5a2-4f05-a183-b79aee97cec2", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 1.050372456395349, 4.008448401162791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 109.47619047619047, 78, 386, 80.0, 236.8, 371.0999999999998, 386.0, 0.11120760871867652, 1.5856289485320594, 0.06503142111408841], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 27.272727272727273, 0.44510385756676557], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.545454545454546, 0.07418397626112759], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.545454545454546, 0.07418397626112759], "isController": false}, {"data": ["401/Unauthorized", 14, 63.63636363636363, 1.0385756676557865], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1348, 22, "401/Unauthorized", 14, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
