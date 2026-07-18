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

    var data = {"OkPercent": 98.75091844232182, "KoPercent": 1.2490815576781777};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.817922735908803, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.35964912280701755, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c0118924-165e-4aaf-a54a-a0b525a292a5"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/38dca12c-96a2-4579-b5bd-6766654dd379"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8f119fd4-c075-4fbe-b546-c5b9f95acd02"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=09936c9e-62c1-4290-abb3-2ec4ec1a6ee9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=06fd6d53-2b1d-4d20-adf4-994d4fcbdf45"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2eb513ca-84c1-44c1-b910-1f7dd81ecd38"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7b9d3b59-f52c-4540-8840-998c092b9ccf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/72eb2b48-aa3f-4bd7-962a-193c43ee0641"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7e9dc189-4119-4b22-bc64-0031a18098ab"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b53ff390-b074-4625-8174-9b0709bb8698"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0bd61841-04de-4fcf-add2-da316f715f31"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/18472267-6e06-4bfd-82fc-6abcb5dd0387"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4c9cb04e-e0d5-418b-bf17-f7ea0233d152"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/982ef411-8816-4061-8cef-56442c95895b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2d61f71f-301c-4cc2-915f-922276f2201b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e9dc189-4119-4b22-bc64-0031a18098ab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c0118924-165e-4aaf-a54a-a0b525a292a5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.18181818181818182, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.421875, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2eb513ca-84c1-44c1-b910-1f7dd81ecd38"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/09936c9e-62c1-4290-abb3-2ec4ec1a6ee9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/06fd6d53-2b1d-4d20-adf4-994d4fcbdf45"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=72eb2b48-aa3f-4bd7-962a-193c43ee0641"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8f119fd4-c075-4fbe-b546-c5b9f95acd02"], "isController": false}, {"data": [0.9567567567567568, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c9cb04e-e0d5-418b-bf17-f7ea0233d152"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f94bfa7e-1bc2-488a-a560-c267636d0bdb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=982ef411-8816-4061-8cef-56442c95895b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b53ff390-b074-4625-8174-9b0709bb8698"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0bd61841-04de-4fcf-add2-da316f715f31"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d61f71f-301c-4cc2-915f-922276f2201b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1361, 17, 1.2490815576781777, 301.7927994121962, 77, 2428, 94.0, 859.3999999999996, 1038.5999999999995, 1580.0, 5.336543362845738, 735.228003606872, 3.9068320302391055], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1372.789473684211, 989, 1784, 1375.0, 1629.4, 1725.8999999999999, 1784.0, 0.26109062593042165, 314.1801044004649, 1.2837805679293681], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c0118924-165e-4aaf-a54a-a0b525a292a5", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 604.0, 89, 1039, 509.0, 1006.1999999999999, 1039.0, 1039.0, 0.07384685298795728, 0.013990517069984096, 0.04992096079016133], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 604.0, 89, 1039, 509.0, 1006.1999999999999, 1039.0, 1039.0, 0.07412856173483642, 0.014043887672420183, 0.05011139776530897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 99.58823529411765, 78, 242, 81.0, 238.0, 242.0, 242.0, 0.07889253444587276, 0.021109916443524546, 0.04499339855116181], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 101.52941176470588, 79, 252, 82.0, 247.2, 252.0, 252.0, 0.07889070389070389, 0.05862873599690006, 0.039599435351388476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 118.47058823529412, 77, 244, 81.0, 243.2, 244.0, 244.0, 0.07883509552958634, 0.02124852184195882, 0.04642340098080134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 137.2941176470588, 79, 245, 81.0, 243.4, 245.0, 245.0, 0.07883436436315745, 0.021248324769757285, 0.04634598373693436], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38dca12c-96a2-4579-b5bd-6766654dd379", 1, 0, 0.0, 171.0, 171, 171, 171.0, 171.0, 171.0, 171.0, 5.847953216374268, 1.8674616228070173, 3.4893548976608186], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 210.3846153846154, 80, 353, 194.0, 319.4, 353.0, 353.0, 0.07412053138719425, 0.1687700891584469, 0.04791219745994641], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8f119fd4-c075-4fbe-b546-c5b9f95acd02", 3, 0, 0.0, 666.6666666666666, 176, 1114, 710.0, 1114.0, 1114.0, 1114.0, 0.01581861323490641, 0.021807235367782757, 0.010144097679936724], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=09936c9e-62c1-4290-abb3-2ec4ec1a6ee9", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=06fd6d53-2b1d-4d20-adf4-994d4fcbdf45", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 83.8, 79, 95, 83.0, 91.60000000000001, 94.85, 95.0, 0.10927110708022139, 0.08120635985160983, 0.05484897367112675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 121.3, 79, 247, 81.5, 243.8, 246.85, 247.0, 0.10927230111075294, 0.03744497115211251, 0.06186050093154637], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 556.5, 407, 729, 548.0, 729.0, 729.0, 729.0, 0.09664014431594885, 28.415411183680703, 0.05511508230518958], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2eb513ca-84c1-44c1-b910-1f7dd81ecd38", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.3389569652908067, 1.2935330675422139], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 894.3333333333333, 767, 976, 909.0, 976.0, 976.0, 976.0, 0.09593859929645028, 86.32572028901504, 0.05462129237288136], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 136.5, 80, 247, 83.0, 247.0, 247.0, 247.0, 0.09698537137315122, 0.1716186454376465, 0.05370186090681322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 104.33333333333333, 81, 243, 83.0, 238.8, 243.0, 243.0, 0.08228782085392815, 0.06115335124007746, 0.0413046288270694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 91.13333333333335, 79, 233, 81.0, 144.20000000000005, 233.0, 233.0, 0.08229098090849242, 0.022019266375905202, 0.04693157504937459], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7b9d3b59-f52c-4540-8840-998c092b9ccf", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 199.0, 5.025125628140704, 1.6047032035175879, 2.998390389447236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 103.26666666666667, 81, 244, 82.0, 244.0, 244.0, 244.0, 0.08229052945726652, 0.02217986926777887, 0.04837783079421333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 117.79999999999998, 79, 318, 82.0, 269.40000000000003, 318.0, 318.0, 0.08222061435243044, 0.022161024962178515, 0.048417021928237845], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 81.0, 78, 82, 81.5, 82.0, 82.0, 82.0, 0.0972431565128604, 0.07226761924442067, 0.05460431151845189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 590.5333333333332, 80, 1028, 719.0, 982.4, 1028.0, 1028.0, 0.08432983083435934, 50.594329855430566, 0.044745320397137286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 119.5, 78, 691, 81.0, 221.70000000000033, 668.2999999999997, 691.0, 0.10917924502552065, 4.939939686996752, 0.06371632502661244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 459.2, 80, 808, 636.0, 763.0, 808.0, 808.0, 0.08432983083435934, 16.538090027716404, 0.04482767374756146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 133.39999999999998, 79, 643, 82.0, 244.60000000000002, 623.0999999999997, 643.0, 0.10917984103415146, 1.6330809288747925, 0.06382329379203423], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 487.0769230769231, 80, 942, 462.0, 911.1999999999999, 942.0, 942.0, 0.07423014771799397, 0.014063133454385575, 0.05077114595645545], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/72eb2b48-aa3f-4bd7-962a-193c43ee0641", 3, 0, 0.0, 375.6666666666667, 179, 514, 434.0, 514.0, 514.0, 514.0, 0.03861600247142416, 0.03219257237282463, 0.0247635172098651], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e9dc189-4119-4b22-bc64-0031a18098ab", 3, 0, 0.0, 379.33333333333337, 169, 709, 260.0, 709.0, 709.0, 709.0, 0.029474180617778827, 0.029560530756307473, 0.018901085877937592], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 234.79999999999998, 163, 562, 168.0, 512.8000000000001, 562.0, 562.0, 0.0821809734610243, 0.12736445789320858, 0.18482693543040915], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b53ff390-b074-4625-8174-9b0709bb8698", 3, 0, 0.0, 391.6666666666667, 236, 473, 466.0, 473.0, 473.0, 473.0, 0.017616902831036285, 0.024286322750468315, 0.011297297713913242], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 535.0, 102, 1410, 469.5, 1222.6, 1390.7999999999997, 1410.0, 0.09531071292413268, 0.058545350028593214, 0.04309458992565764], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0bd61841-04de-4fcf-add2-da316f715f31", 3, 0, 0.0, 345.6666666666667, 192, 536, 309.0, 536.0, 536.0, 536.0, 0.020227355475545127, 0.02788504246059037, 0.012971318452742155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 83.8, 80, 103, 82.0, 95.80000000000001, 103.0, 103.0, 0.08432888264230498, 0.06267019501054111, 0.042329146170063246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 135.4, 78, 247, 84.0, 244.6, 247.0, 247.0, 0.08432840855427377, 0.10700264861476534, 0.043372033045492364], "isController": false}, {"data": ["login", 22, 0, 0.0, 2682.1363636363644, 1386, 3668, 2818.5, 3385.8, 3628.5499999999993, 3668.0, 0.0902027511839111, 29.55409378267287, 0.17688996545644642], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/18472267-6e06-4bfd-82fc-6abcb5dd0387", 1, 0, 0.0, 825.0, 825, 825, 825.0, 825.0, 825.0, 825.0, 1.2121212121212122, 0.38707386363636365, 0.7232481060606061], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 110.65000000000002, 81, 258, 86.5, 246.00000000000003, 257.45, 258.0, 0.10778533472735699, 0.0872598071181435, 0.03831431820386518], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c9cb04e-e0d5-418b-bf17-f7ea0233d152", 3, 0, 0.0, 436.66666666666663, 255, 722, 333.0, 722.0, 722.0, 722.0, 0.05782017924255565, 0.03754923749638624, 0.03707869567312325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/982ef411-8816-4061-8cef-56442c95895b", 3, 0, 0.0, 471.0, 182, 714, 517.0, 714.0, 714.0, 714.0, 0.027984030446625126, 0.023329134757098618, 0.017945488274691244], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d61f71f-301c-4cc2-915f-922276f2201b", 3, 0, 0.0, 573.0, 353, 900, 466.0, 900.0, 900.0, 900.0, 0.08546034639927075, 0.038668581215815866, 0.05480367265838651], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 683.2, 163, 1111, 861.0, 1065.4, 1111.0, 1111.0, 0.08428907782129592, 67.26957100195831, 0.17519067769823385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 268.70588235294116, 160, 496, 316.0, 488.8, 496.0, 496.0, 0.07880257174510613, 0.12212859507762053, 0.17722883079001894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 751.75, 78, 1057, 973.0, 1057.0, 1057.0, 1057.0, 0.12774859077335804, 114.63234105280807, 0.2372050554508727], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 952.6956521739129, 113, 1643, 1044.0, 1554.0, 1630.3999999999999, 1643.0, 0.09278383786226038, 0.029089498079777964, 0.041861458098012005], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 97.29411764705881, 83, 238, 85.0, 129.99999999999991, 238.0, 238.0, 0.08633648884735709, 0.06702881702504775, 0.030689923769958966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 237.29999999999998, 163, 773, 167.0, 337.8, 751.2999999999997, 773.0, 0.1091292035205081, 6.68849584661072, 0.24403804994297998], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 348.8947368421053, 160, 1053, 172.0, 957.0, 1053.0, 1053.0, 0.09862444848170257, 18.758576920581365, 0.21782438197508433], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e9dc189-4119-4b22-bc64-0031a18098ab", 1, 0, 0.0, 865.0, 865, 865, 865.0, 865.0, 865.0, 865.0, 1.1560693641618498, 0.20886018786127167, 0.7970556358381503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 85.33333333333333, 80, 113, 82.0, 113.0, 113.0, 113.0, 0.05995004163197335, 0.04455271648626145, 0.030092110741049127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 98.55555555555556, 78, 240, 81.0, 240.0, 240.0, 240.0, 0.059950440968799125, 0.016041426587354454, 0.03419048586501825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 98.44444444444444, 79, 239, 81.0, 239.0, 239.0, 239.0, 0.059950840310945025, 0.0161586249275594, 0.035244536979676666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 119.7777777777778, 77, 254, 83.0, 254.0, 254.0, 254.0, 0.05988183318251983, 0.016140025349976047, 0.03526244668853463], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 80.0, 80, 80, 80.0, 80.0, 80.0, 80.0, 12.5, 3.6865234375, 7.72705078125], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 964.1228070175438, 628, 1418, 951.0, 1284.0, 1385.0, 1418.0, 0.26141992294991745, 312.7491121181893, 0.5162022306686846], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 952.6956521739129, 113, 1643, 1044.0, 1554.0, 1630.3999999999999, 1643.0, 0.09178412374096126, 0.028776068686449472, 0.041410415203441506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 82.22222222222223, 80, 85, 82.0, 85.0, 85.0, 85.0, 0.0426657564638621, 0.011499754671900333, 0.025124464011434422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 82.88888888888889, 80, 88, 82.0, 88.0, 88.0, 88.0, 0.042665958727795925, 0.011499809188351246, 0.02508291714270815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 170.52941176470588, 79, 935, 83.0, 380.5999999999995, 935.0, 935.0, 0.09016702114681843, 4.795369964901162, 0.052552538864638086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 135.23529411764707, 79, 558, 82.0, 373.1999999999998, 558.0, 558.0, 0.09016797763834154, 1.5824252169335462, 0.05264115100749455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 82.33333333333333, 79, 86, 82.0, 86.0, 86.0, 86.0, 0.0426657564638621, 0.011416423116306851, 0.024332814233296356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 104.88235294117646, 81, 252, 83.0, 251.2, 252.0, 252.0, 0.09016702114681843, 0.067008889738993, 0.045259618036586596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 84.22222222222223, 80, 101, 83.0, 101.0, 101.0, 101.0, 0.04266555420184599, 0.03170750658945781, 0.021416108261473478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 118.58823529411765, 79, 243, 81.0, 242.2, 243.0, 243.0, 0.09016654290866659, 0.0320928251299459, 0.05097766057600509], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0118924-165e-4aaf-a54a-a0b525a292a5", 3, 0, 0.0, 303.3333333333333, 216, 425, 269.0, 425.0, 425.0, 425.0, 0.022673851758357202, 0.03125773509005298, 0.014540197904936096], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 88.22222222222223, 84, 101, 87.0, 101.0, 101.0, 101.0, 0.04225094243074366, 0.03325611288982362, 0.01501888969217841], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 667.7692307692307, 78, 1999, 536.0, 1540.5999999999995, 1999.0, 1999.0, 0.0721556786519099, 0.01351834905032026, 0.0491083570151971], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1555.4545454545453, 707, 2428, 1561.0, 2071.0, 2377.149999999999, 2428.0, 0.09260272588751295, 0.04792914523474791, 0.04259363661427597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 168.55555555555554, 163, 190, 166.0, 190.0, 190.0, 190.0, 0.042648571035933794, 0.06609695530666693, 0.09591763583569876], "isController": false}, {"data": ["addBook", 64, 6, 9.375, 847.21875, 412, 1822, 725.0, 1420.5, 1591.25, 1822.0, 0.2947149323767378, 83.74621425142408, 1.0742371876712455], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 156.19298245614036, 79, 470, 85.0, 330.4, 344.09999999999945, 470.0, 0.26236329491475496, 0.1949789720997349, 0.12682600681914424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2eb513ca-84c1-44c1-b910-1f7dd81ecd38", 3, 0, 0.0, 888.0, 194, 1999, 471.0, 1999.0, 1999.0, 1999.0, 0.02548181872234161, 0.02555647248812972, 0.016340879844730784], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/09936c9e-62c1-4290-abb3-2ec4ec1a6ee9", 3, 0, 0.0, 347.3333333333333, 223, 489, 330.0, 489.0, 489.0, 489.0, 0.03806671826821809, 0.03173465673336802, 0.02441127441028309], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/06fd6d53-2b1d-4d20-adf4-994d4fcbdf45", 3, 0, 0.0, 437.66666666666663, 227, 853, 233.0, 853.0, 853.0, 853.0, 0.05319054626691016, 0.034819722832928494, 0.03410982296413184], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=72eb2b48-aa3f-4bd7-962a-193c43ee0641", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 512.0350877192983, 388, 736, 479.0, 642.2, 664.8, 736.0, 0.2622401751948399, 77.10731870059993, 0.13188836936068604], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 132.6491228070176, 77, 397, 85.0, 245.2, 256.8999999999995, 397.0, 0.26269702276707535, 0.46485059106830123, 0.12775695052539404], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 806.4035087719299, 544, 1092, 797.0, 1013.6, 1047.2, 1092.0, 0.26186188393546256, 235.62378346922205, 0.1314423909597927], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 95.0, 82, 236, 85.0, 107.0, 236.0, 236.0, 0.10431078024463623, 0.07792748719447921, 0.03707922266508554], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8f119fd4-c075-4fbe-b546-c5b9f95acd02", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 185, 6, 3.2432432432432434, 149.3027027027028, 80, 722, 89.0, 254.4, 406.09999999999974, 608.4799999999982, 0.7662454387687058, 1.5724493799107013, 0.3714858521581199], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 106.44444444444444, 81, 245, 86.0, 245.0, 245.0, 245.0, 0.05971694169635926, 0.04624563941915321, 0.0212275066186277], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 86.99999999999999, 81, 103, 85.0, 97.39999999999999, 103.0, 103.0, 0.07642407268378866, 0.06201992617209802, 0.027166369586815498], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c9cb04e-e0d5-418b-bf17-f7ea0233d152", 1, 0, 0.0, 942.0, 942, 942, 942.0, 942.0, 942.0, 942.0, 1.0615711252653928, 0.19178775212314225, 0.7319035297239915], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f94bfa7e-1bc2-488a-a560-c267636d0bdb", 1, 0, 0.0, 376.0, 376, 376, 376.0, 376.0, 376.0, 376.0, 2.6595744680851063, 0.8492977061170213, 1.5869140625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 222.22222222222223, 160, 354, 168.0, 354.0, 354.0, 354.0, 0.05984838409362948, 0.0927533062076074, 0.1346004185230749], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 301.1176470588235, 163, 1017, 191.0, 597.7999999999996, 1017.0, 1017.0, 0.09012734463636267, 6.474030236398723, 0.20134204420746252], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=982ef411-8816-4061-8cef-56442c95895b", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.3635091800804829, 1.3872296277665996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b53ff390-b074-4625-8174-9b0709bb8698", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 91.06666666666666, 81, 132, 86.0, 115.80000000000001, 132.0, 132.0, 0.08135416723162617, 0.06745086716762755, 0.028918864133117114], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 85.13333333333333, 82, 91, 85.0, 90.4, 91.0, 91.0, 0.07967407989716732, 0.061856341326414085, 0.028321645588446197], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0bd61841-04de-4fcf-add2-da316f715f31", 1, 0, 0.0, 563.0, 563, 563, 563.0, 563.0, 563.0, 563.0, 1.7761989342806395, 0.32089531527531084, 1.2246059058614567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d61f71f-301c-4cc2-915f-922276f2201b", 1, 0, 0.0, 206.0, 206, 206, 206.0, 206.0, 206.0, 206.0, 4.854368932038835, 0.8770100121359223, 3.3468598300970878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 101.42105263157895, 78, 268, 83.0, 245.0, 268.0, 268.0, 0.09866644509991276, 0.07332535617288438, 0.04952593045054214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 123.42105263157892, 78, 249, 82.0, 244.0, 249.0, 249.0, 0.09867208151352586, 0.0498026233790514, 0.05496546152567811], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 236.21052631578948, 78, 970, 83.0, 868.0, 970.0, 970.0, 0.09867156908567808, 14.041056582627053, 0.05666920810872569], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 187.10526315789474, 78, 647, 82.0, 641.0, 647.0, 647.0, 0.0986710566631526, 4.603327340581329, 0.056765272267201225], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 41.1764705882353, 0.5143277002204262], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.882352941176471, 0.07347538574577517], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.882352941176471, 0.07347538574577517], "isController": false}, {"data": ["401/Unauthorized", 8, 47.05882352941177, 0.5878030859662013], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1361, 17, "401/Unauthorized", 8, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 185, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
