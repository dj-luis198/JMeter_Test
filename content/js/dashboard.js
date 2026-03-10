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

    var data = {"OkPercent": 98.51961509992599, "KoPercent": 1.4803849000740192};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7633587786259542, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f230997c-0f4f-4a30-810a-9834458cd806"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bcbc0d9b-6a25-499e-820f-c3e8a8b592de"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e1ca828d-60a3-483c-90e8-1d49e20c5d1f"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e972c5b9-0d10-42be-9c2d-5f1b98e2ffac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/001337cb-36de-414e-9a5f-0bf15ab96977"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=56315dd3-532b-42e1-a565-ac13c60f2adb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/de8116a1-b098-44ff-ace1-f605ba156c5e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0c4930ef-8325-4af4-bd54-59253b83871f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/56315dd3-532b-42e1-a565-ac13c60f2adb"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9efd6417-e76e-4865-8988-141acbcf1cb4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bd6c8d62-0daf-47a7-8a9c-f151bed84714"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c56931ea-a4c7-444b-ae2c-f09d9fb0d08a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/72dd41a7-8046-4079-8c06-6a162cb29137"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a2418c7f-d057-4321-b8b3-87830a13961a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bcbc0d9b-6a25-499e-820f-c3e8a8b592de"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ef545c72-c74d-463b-8902-487bd2e1c14c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ff702165-9ff5-432a-90c3-c214d4428740"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fdc3c707-6b73-46a4-b76e-c35650d7b76d"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3474576271186441, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bd6c8d62-0daf-47a7-8a9c-f151bed84714"], "isController": false}, {"data": [0.28688524590163933, 500, 1500, "addBook"], "isController": true}, {"data": [0.9152542372881356, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9475138121546961, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c4930ef-8325-4af4-bd54-59253b83871f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=001337cb-36de-414e-9a5f-0bf15ab96977"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=72dd41a7-8046-4079-8c06-6a162cb29137"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ef545c72-c74d-463b-8902-487bd2e1c14c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/01ced576-78cf-4949-a697-d795e9e855e2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/425d521f-f087-4191-882a-2b22815e510c"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fdc3c707-6b73-46a4-b76e-c35650d7b76d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9efd6417-e76e-4865-8988-141acbcf1cb4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c56931ea-a4c7-444b-ae2c-f09d9fb0d08a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e972c5b9-0d10-42be-9c2d-5f1b98e2ffac"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ff702165-9ff5-432a-90c3-c214d4428740"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1351, 20, 1.4803849000740192, 429.46484085862306, 137, 3001, 160.0, 1109.9999999999998, 1307.3999999999999, 1864.6800000000003, 5.241045415927968, 736.6949084684004, 3.822631127969182], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 2107.576271186441, 1721, 2774, 2084.0, 2532.0, 2643.0, 2774.0, 0.2621744482116592, 315.4839007114259, 1.2891097136188516], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f230997c-0f4f-4a30-810a-9834458cd806", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 1.4581549657534247, 2.724564783105023], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 518.2142857142857, 147, 757, 568.5, 743.0, 757.0, 757.0, 0.08993903418325722, 0.017716785193465288, 0.06051561967994552], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 518.2142857142857, 147, 757, 568.5, 743.0, 757.0, 757.0, 0.09111083633239837, 0.017947614523067312, 0.06130406858693601], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 249.29411764705884, 142, 445, 151.0, 444.2, 445.0, 445.0, 0.12054429293681353, 0.06420534720301786, 0.0669613575769179], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 148.47058823529412, 139, 159, 147.0, 159.0, 159.0, 159.0, 0.12055369603449255, 0.08959117449438363, 0.06051230445481364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 339.8235294117647, 138, 1009, 151.0, 969.8, 1009.0, 1009.0, 0.12055198627125616, 6.281985610879462, 0.06916088504658979], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bcbc0d9b-6a25-499e-820f-c3e8a8b592de", 3, 0, 0.0, 336.6666666666667, 243, 519, 248.0, 519.0, 519.0, 519.0, 0.028975708697541895, 0.028890818925967066, 0.018581427778046073], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 369.47058823529414, 142, 1345, 150.0, 1076.1999999999998, 1345.0, 1345.0, 0.12055113140782447, 19.168897176532948, 0.06904266889568073], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e1ca828d-60a3-483c-90e8-1d49e20c5d1f", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.7846091830466831, 1.4660434582309583], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 262.2857142857143, 150, 402, 240.0, 387.5, 402.0, 402.0, 0.08955185692171888, 0.16481139739276165, 0.057881382968516124], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e972c5b9-0d10-42be-9c2d-5f1b98e2ffac", 3, 0, 0.0, 427.0, 260, 619, 402.0, 619.0, 619.0, 619.0, 0.017607080393929078, 0.02427278172795887, 0.011290998820325615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 166.4375, 140, 438, 148.5, 241.30000000000018, 438.0, 438.0, 0.0961382467988968, 0.07144649005269578, 0.04825689341272751], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 834.3333333333334, 743, 1011, 749.0, 1011.0, 1011.0, 1011.0, 0.016681030887708857, 4.9047769433400985, 0.00951340042814646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 147.62499999999997, 143, 155, 147.5, 153.6, 155.0, 155.0, 0.09614460148062687, 0.03475148498341506, 0.054327802765359104], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1181.3333333333333, 994, 1276, 1274.0, 1276.0, 1276.0, 1276.0, 0.016682607825255245, 15.011039846061236, 0.00949800816613653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 340.6666666666667, 148, 446, 428.0, 446.0, 446.0, 446.0, 0.01673360107095047, 0.02961063002008032, 0.009265577936746988], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 150.6, 144, 158, 149.0, 157.4, 158.0, 158.0, 0.0681149416936099, 0.05062057678597377, 0.03419050784230029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 208.2, 139, 449, 149.0, 445.4, 449.0, 449.0, 0.0681174162609896, 0.031867952685642666, 0.03808544081050643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 342.53333333333336, 144, 1281, 149.0, 1132.8000000000002, 1281.0, 1281.0, 0.06811710693023446, 8.18816407083725, 0.03926490004949843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 331.0, 139, 1030, 147.0, 1024.0, 1030.0, 1030.0, 0.0681174162609896, 2.6864160816137472, 0.039331599272051876], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/001337cb-36de-414e-9a5f-0bf15ab96977", 3, 0, 0.0, 388.0, 298, 535, 331.0, 535.0, 535.0, 535.0, 0.07943653021236032, 0.0359429612614521, 0.05094074365831701], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=56315dd3-532b-42e1-a565-ac13c60f2adb", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 151.0, 147, 159, 147.0, 159.0, 159.0, 159.0, 0.016760338335363195, 0.012455681126183001, 0.00941132279573617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 625.9047619047618, 137, 1388, 149.0, 1345.4, 1384.3, 1388.0, 0.11138988049457106, 42.97236043278947, 0.06138253738191347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 237.74999999999997, 139, 997, 150.0, 606.4000000000004, 997.0, 997.0, 0.09614344602146403, 5.431171667502914, 0.0560054351091829], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 512.7142857142858, 140, 1149, 413.0, 1068.0, 1141.6999999999998, 1149.0, 0.11138692635732926, 14.053493322751574, 0.06148968576952454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 258.56250000000006, 139, 1116, 144.0, 642.8000000000004, 1116.0, 1116.0, 0.09614517922062314, 1.7911616853949464, 0.05610033650812728], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 410.78571428571433, 147, 689, 413.0, 684.0, 689.0, 689.0, 0.09095043201455207, 0.017916017020723703, 0.06177980656792048], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 538.7333333333332, 294, 1437, 316.0, 1284.6000000000001, 1437.0, 1437.0, 0.0680685768221958, 10.949251578907363, 0.15076569349400543], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de8116a1-b098-44ff-ace1-f605ba156c5e", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 1.2621973814229248, 2.3584177371541504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c4930ef-8325-4af4-bd54-59253b83871f", 3, 0, 0.0, 350.6666666666667, 287, 445, 320.0, 445.0, 445.0, 445.0, 0.03736501886933453, 0.030371240923414165, 0.023961291397327156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 584.4761904761904, 147, 1111, 615.0, 1016.2000000000002, 1105.1, 1111.0, 0.08745663608460805, 0.053720921969939904, 0.03954338135466165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 149.23809523809524, 139, 179, 146.0, 157.8, 176.89999999999998, 179.0, 0.11138042780691937, 0.08277393121197817, 0.05590775380152008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 249.80952380952382, 138, 573, 150.0, 451.6, 560.8999999999999, 573.0, 0.11138751717224223, 0.10150436135171403, 0.05951648866764617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/56315dd3-532b-42e1-a565-ac13c60f2adb", 3, 0, 0.0, 345.0, 247, 467, 321.0, 467.0, 467.0, 467.0, 0.0221090566065546, 0.026132156425260334, 0.014178008305635599], "isController": false}, {"data": ["login", 21, 0, 0.0, 2390.714285714286, 1368, 4542, 2153.0, 3411.6000000000004, 4435.999999999998, 4542.0, 0.08666298005100735, 14.93310265977971, 0.15128541704495743], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9efd6417-e76e-4865-8988-141acbcf1cb4", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 0.6569602272727272, 2.5071022727272725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd6c8d62-0daf-47a7-8a9c-f151bed84714", 3, 0, 0.0, 316.3333333333333, 233, 459, 257.0, 459.0, 459.0, 459.0, 0.0574085768413801, 0.03638492809575751, 0.036814744914556906], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c56931ea-a4c7-444b-ae2c-f09d9fb0d08a", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 153.31250000000003, 145, 162, 153.5, 162.0, 162.0, 162.0, 0.09581182557457153, 0.07756640957160138, 0.03405810987221098], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72dd41a7-8046-4079-8c06-6a162cb29137", 3, 0, 0.0, 478.33333333333337, 247, 839, 349.0, 839.0, 839.0, 839.0, 0.022618975812775197, 0.022685242343476686, 0.014505007275770553], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2418c7f-d057-4321-b8b3-87830a13961a", 1, 0, 0.0, 303.0, 303, 303, 303.0, 303.0, 303.0, 303.0, 3.3003300330033003, 1.0539139851485149, 1.969239892739274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bcbc0d9b-6a25-499e-820f-c3e8a8b592de", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 806.3809523809524, 290, 1528, 579.0, 1495.4, 1524.8999999999999, 1528.0, 0.11129247662857991, 57.16048673234689, 0.23809572113550123], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef545c72-c74d-463b-8902-487bd2e1c14c", 3, 0, 0.0, 536.3333333333334, 233, 1013, 363.0, 1013.0, 1013.0, 1013.0, 0.036157211555844816, 0.030142779555507343, 0.023186753504236417], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ff702165-9ff5-432a-90c3-c214d4428740", 3, 0, 0.0, 464.33333333333337, 233, 787, 373.0, 787.0, 787.0, 787.0, 0.01845744942658857, 0.025445084089063347, 0.011836320107545406], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 4, 57.142857142857146, 659.1428571428572, 143, 1437, 152.0, 1437.0, 1437.0, 1437.0, 0.03427676035647831, 17.579636084859466, 0.04610243395602781], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 580.3529411764706, 287, 1494, 573.0, 1224.3999999999999, 1494.0, 1494.0, 0.12041962698249666, 25.57670542083118, 0.26538941803673505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fdc3c707-6b73-46a4-b76e-c35650d7b76d", 3, 0, 0.0, 481.6666666666667, 224, 996, 225.0, 996.0, 996.0, 996.0, 0.04451104615795487, 0.028616313854804967, 0.028543867490615587], "isController": false}, {"data": ["register", 24, 4, 16.666666666666668, 1149.2083333333333, 163, 3001, 1013.0, 1965.5, 2765.25, 3001.0, 0.09702497180211758, 0.030888809382314773, 0.04377493844978351], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 194.1875, 141, 500, 154.5, 466.40000000000003, 500.0, 500.0, 0.08268605654692691, 0.06419474116680363, 0.02939230916316543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 449.3125, 292, 1264, 302.0, 991.0000000000002, 1264.0, 1264.0, 0.09605340569356563, 7.321639190765064, 0.21449035038481393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 462.375, 291, 1732, 306.0, 932.6000000000008, 1732.0, 1732.0, 0.0837863030341115, 6.386583333660624, 0.18709751481970235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 172.58333333333334, 143, 446, 147.0, 360.2000000000003, 446.0, 446.0, 0.07061066456403799, 0.052475308333235264, 0.03544324373624563], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 195.33333333333331, 142, 441, 148.5, 437.40000000000003, 441.0, 441.0, 0.07061066456403799, 0.018893869229049228, 0.04027014463417792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 192.41666666666666, 142, 436, 145.5, 433.90000000000003, 436.0, 436.0, 0.0706127420693064, 0.019032340635867742, 0.04151256906808833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 169.08333333333334, 142, 429, 145.0, 345.3000000000003, 429.0, 429.0, 0.07061191105252937, 0.01903211665087706, 0.04158103746550314], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 149.5, 147, 152, 149.5, 152.0, 152.0, 152.0, 0.013866163787126655, 0.004089435023156494, 0.008571564137940598], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 1392.3050847457628, 1106, 2137, 1181.0, 1887.0, 2039.0, 2137.0, 0.2546813892653953, 304.68748313814956, 0.5028962588814738], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 4, 16.666666666666668, 1149.2083333333333, 163, 3001, 1013.0, 1965.5, 2765.25, 3001.0, 0.0953663857331887, 0.03036078295802687, 0.04302663106321599], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 148.85714285714286, 143, 156, 149.0, 156.0, 156.0, 156.0, 0.04612850082372323, 0.012433072487644152, 0.02716356054365733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 146.0, 143, 151, 145.0, 151.0, 151.0, 151.0, 0.04613032475748629, 0.012433564094791228, 0.02711958545313159], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 256.625, 142, 1306, 146.5, 710.3000000000006, 1306.0, 1306.0, 0.07734363292711813, 4.369164672147591, 0.04505417679787692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 257.25, 138, 999, 148.5, 628.0000000000003, 999.0, 999.0, 0.07745858386344052, 1.4430348848045622, 0.04519678111172432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 167.24999999999997, 140, 444, 149.5, 241.0000000000002, 444.0, 444.0, 0.07777864198491094, 0.05780229155323948, 0.039041232402582254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 147.71428571428572, 137, 158, 149.0, 158.0, 158.0, 158.0, 0.04612850082372323, 0.012342977759472818, 0.026307660626029655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 199.5, 138, 452, 147.0, 445.0, 452.0, 452.0, 0.07778242311693614, 0.028114472027496087, 0.043952006421911306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 148.28571428571428, 138, 158, 149.0, 158.0, 158.0, 158.0, 0.04613184481247405, 0.03428352920145777, 0.023156023665636388], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 606.4285714285714, 143, 1020, 527.0, 1016.5, 1020.0, 1020.0, 0.0919588549808857, 0.01775544856215762, 0.06258025873280698], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 155.57142857142858, 150, 163, 153.0, 163.0, 163.0, 163.0, 0.04696064027478684, 0.03696316021628729, 0.016693040097678132], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1234.1428571428569, 771, 2667, 1102.0, 1892.8000000000002, 2597.7999999999993, 2667.0, 0.0852359208523592, 0.04411624809741248, 0.03920519406392694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 300.85714285714283, 287, 315, 300.0, 315.0, 315.0, 315.0, 0.04608659011903508, 0.07142521339737175, 0.1036498213321658], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bd6c8d62-0daf-47a7-8a9c-f151bed84714", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["addBook", 61, 8, 13.114754098360656, 1315.4098360655732, 747, 2353, 1179.0, 2052.4, 2103.2, 2353.0, 0.2871642296937229, 96.84479405970191, 1.0426207546181658], "isController": true}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 266.11864406779654, 143, 635, 152.0, 588.0, 605.0, 635.0, 0.2561097365108304, 0.1903315522311933, 0.12380304645787212], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 829.5084745762707, 687, 1163, 737.0, 1029.0, 1054.0, 1163.0, 0.2557467153885833, 75.19802591440288, 0.12862261564953165], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 234.28813559322032, 139, 469, 152.0, 442.0, 448.0, 469.0, 0.2564592968668498, 0.4538127401589178, 0.12472336898407343], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 1124.5593220338983, 957, 1473, 1030.0, 1390.0, 1439.0, 1473.0, 0.2554223126542275, 229.8294459108078, 0.12821002803151652], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 188.1875, 145, 445, 152.5, 433.1, 445.0, 445.0, 0.08187074655887018, 0.06116320421634345, 0.029102491940848383], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 8, 4.419889502762431, 202.80662983425412, 139, 829, 154.0, 317.6, 397.40000000000026, 676.4800000000013, 0.7608654529251283, 1.6480875110871969, 0.36524366085578447], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 202.49999999999997, 149, 456, 155.0, 447.6, 456.0, 456.0, 0.07362776257500829, 0.05701837472849763, 0.026172368727834974], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c4930ef-8325-4af4-bd54-59253b83871f", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.45507320528967254, 1.7366577455919394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 187.0, 140, 480, 153.0, 442.4, 480.0, 480.0, 0.11968291068838793, 0.09712548709184607, 0.0425435346587629], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=001337cb-36de-414e-9a5f-0bf15ab96977", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 0.8101527466367713, 3.0917180493273544], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=72dd41a7-8046-4079-8c06-6a162cb29137", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ef545c72-c74d-463b-8902-487bd2e1c14c", 1, 0, 0.0, 545.0, 545, 545, 545.0, 545.0, 545.0, 545.0, 1.834862385321101, 0.33149369266055045, 1.265051605504587], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/01ced576-78cf-4949-a697-d795e9e855e2", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 1.0861766581632655, 2.0295227465986394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/425d521f-f087-4191-882a-2b22815e510c", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.5991293386491557, 1.1194740853658536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 393.0, 289, 877, 297.5, 789.4000000000003, 877.0, 877.0, 0.07054964049079034, 0.10933816353406667, 0.15866779497098646], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fdc3c707-6b73-46a4-b76e-c35650d7b76d", 1, 0, 0.0, 689.0, 689, 689, 689.0, 689.0, 689.0, 689.0, 1.4513788098693758, 0.2622119920174166, 1.000657656023222], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9efd6417-e76e-4865-8988-141acbcf1cb4", 3, 0, 0.0, 322.3333333333333, 225, 496, 246.0, 496.0, 496.0, 496.0, 0.07499062617172854, 0.033931305461817274, 0.048089691913510806], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c56931ea-a4c7-444b-ae2c-f09d9fb0d08a", 3, 0, 0.0, 1404.3333333333333, 219, 2974, 1020.0, 2974.0, 2974.0, 2974.0, 0.039949929421791354, 0.025683955276054014, 0.02561893260446907], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e972c5b9-0d10-42be-9c2d-5f1b98e2ffac", 1, 0, 0.0, 679.0, 679, 679, 679.0, 679.0, 679.0, 679.0, 1.4727540500736376, 0.2660737297496318, 1.0153948821796759], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 518.5625, 291, 1446, 432.0, 1057.5000000000005, 1446.0, 1446.0, 0.07728796529770358, 5.891249681489049, 0.17258651723521626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 158.06666666666666, 147, 175, 159.0, 169.0, 175.0, 175.0, 0.06816694539373228, 0.05651732093679561, 0.02423121887042827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 166.95238095238096, 146, 430, 153.0, 163.8, 403.39999999999964, 430.0, 0.1100957833314984, 0.0854747536606848, 0.03913561048111858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 165.5, 143, 427, 149.5, 235.9000000000002, 427.0, 427.0, 0.08385304753419631, 0.062316571458518946, 0.04209029925056339], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 199.6875, 139, 435, 148.0, 431.5, 435.0, 435.0, 0.08385656334839257, 0.030309971200511526, 0.04738428121822623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 238.62499999999991, 138, 1304, 149.5, 701.3000000000006, 1304.0, 1304.0, 0.08385348699484825, 4.736908251510673, 0.04884629393791697], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ff702165-9ff5-432a-90c3-c214d4428740", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 258.00000000000006, 142, 1028, 149.5, 619.9000000000004, 1028.0, 1028.0, 0.08385304753419631, 1.562162213065353, 0.04892792568523662], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 20.0, 0.29607698001480387], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 10.0, 0.14803849000740193], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 10.0, 0.14803849000740193], "isController": false}, {"data": ["401/Unauthorized", 12, 60.0, 0.8882309400444115], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1351, 20, "401/Unauthorized", 12, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
