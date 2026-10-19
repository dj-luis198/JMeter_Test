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

    var data = {"OkPercent": 95.83023082650782, "KoPercent": 4.169769173492182};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7206349206349206, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b8dcb447-2d90-4db6-8da2-8c827157e6ec"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6ba91b25-94eb-4da8-9a54-d25b57613897"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d7c968f4-abb9-4c83-aa2a-b0484bf28569"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f6d7aecc-e59f-4a9a-bbf2-aeaa35174bdd"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.631578947368421, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3063e055-3045-4195-a887-2d63ece81c13"], "isController": false}, {"data": [0.6739130434782609, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8043478260869565, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ae10bf24-8e9c-41d0-8455-5f1628ddff5a"], "isController": false}, {"data": [0.5588235294117647, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ca5ce265-8ac3-4e9d-8bbb-c8997f255d6b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=13cbe978-4aac-4b72-a353-f23c1c36dcb2"], "isController": false}, {"data": [0.8958333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.14583333333333334, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=45eceeaf-1244-4395-b840-f15c86688ae7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/da9e9923-66d9-47dd-8cf5-f753ecca679e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cd84c299-194b-44a2-9e22-6480bee5b6a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ea914d50-a1ff-4868-a0a6-f4b4d0c2a477"], "isController": false}, {"data": [0.6086956521739131, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b8dcb447-2d90-4db6-8da2-8c827157e6ec"], "isController": false}, {"data": [0.06521739130434782, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.38, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2672413793103448, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.38, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d7c968f4-abb9-4c83-aa2a-b0484bf28569"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0241fbf9-4179-4927-9ef5-510ff94c6ad5"], "isController": false}, {"data": [0.46875, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4791666666666667, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.19090909090909092, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da9e9923-66d9-47dd-8cf5-f753ecca679e"], "isController": false}, {"data": [0.9137931034482759, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3879310344827586, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae10bf24-8e9c-41d0-8455-5f1628ddff5a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/13cbe978-4aac-4b72-a353-f23c1c36dcb2"], "isController": false}, {"data": [0.8630952380952381, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3063e055-3045-4195-a887-2d63ece81c13"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6ba91b25-94eb-4da8-9a54-d25b57613897"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cd84c299-194b-44a2-9e22-6480bee5b6a8"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/45eceeaf-1244-4395-b840-f15c86688ae7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ea914d50-a1ff-4868-a0a6-f4b4d0c2a477"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4094d895-1b1d-48b2-a6b3-6200bfd34e42"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ca5ce265-8ac3-4e9d-8bbb-c8997f255d6b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1343, 56, 4.169769173492182, 430.6552494415483, 125, 2437, 144.0, 1146.2000000000003, 1509.0, 1950.4799999999996, 5.231543519586151, 767.6666353917523, 3.8275161891049114], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 2159.3965517241377, 1575, 2991, 2155.0, 2557.6, 2659.1999999999994, 2991.0, 0.2469556331431491, 297.17117461599463, 1.2142789188239802], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b8dcb447-2d90-4db6-8da2-8c827157e6ec", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ba91b25-94eb-4da8-9a54-d25b57613897", 3, 0, 0.0, 331.0, 224, 535, 234.0, 535.0, 535.0, 535.0, 0.019205039402339173, 0.022699706402960138, 0.012315731647984432], "isController": false}, {"data": ["deleteBook", 18, 7, 38.888888888888886, 435.83333333333337, 129, 1281, 448.0, 904.8000000000006, 1281.0, 1281.0, 0.08358214499644777, 0.018814144943048054, 0.05525436397470247], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 7, 38.888888888888886, 435.83333333333337, 129, 1281, 448.0, 904.8000000000006, 1281.0, 1281.0, 0.08361708947493114, 0.01882201086325354, 0.055277465020184234], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d7c968f4-abb9-4c83-aa2a-b0484bf28569", 1, 0, 0.0, 924.0, 924, 924, 924.0, 924.0, 924.0, 924.0, 1.0822510822510822, 0.19552387716450215, 0.7461613906926406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 193.41176470588235, 128, 422, 132.0, 396.4, 422.0, 422.0, 0.1474414570685169, 0.03945210862966175, 0.08408770598438856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 132.94117647058823, 127, 143, 132.0, 142.2, 143.0, 143.0, 0.14776312701544558, 0.10981224576050204, 0.07417016336517483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 208.7058823529412, 127, 423, 128.0, 417.4, 423.0, 423.0, 0.14743889958543652, 0.03973939090388718, 0.08682193012697091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f6d7aecc-e59f-4a9a-bbf2-aeaa35174bdd", 2, 0, 0.0, 275.0, 223, 327, 275.0, 327.0, 327.0, 327.0, 0.0123734811551882, 0.02445695884580168, 0.007691133550075478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 186.58823529411765, 126, 510, 140.0, 416.3999999999999, 510.0, 510.0, 0.14774900052146706, 0.039822972796801664, 0.0868602522596906], "isController": false}, {"data": ["goToProfile", 19, 7, 36.8421052631579, 220.3157894736842, 127, 432, 226.0, 398.0, 432.0, 432.0, 0.0869334455842385, 0.10634333906789045, 0.05616983678245592], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 131.9411764705882, 127, 143, 129.0, 141.4, 143.0, 143.0, 0.14113154289983812, 0.10488389076833672, 0.0708414189946453], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 10, 0, 0.0, 896.3000000000001, 631, 1130, 915.5, 1125.5, 1130.0, 1130.0, 0.05580014619638304, 16.40709572096579, 0.031823520877624696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 225.11764705882354, 126, 422, 132.0, 418.0, 422.0, 422.0, 0.14112685644078066, 0.07516821076050773, 0.07839480134319561], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 10, 0, 0.0, 1370.8, 1009, 2007, 1382.0, 1970.4, 2007.0, 2007.0, 0.05568331783480987, 50.103947268594055, 0.03170251396259195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 10, 0, 0.0, 182.1, 126, 383, 132.0, 382.6, 383.0, 383.0, 0.056071412551024984, 0.09922011674068093, 0.03104735441057731], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 152.2, 126, 409, 132.0, 250.0000000000001, 409.0, 409.0, 0.07074337134610487, 0.05257393124451739, 0.0355098563202128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 133.93333333333334, 126, 143, 136.0, 142.4, 143.0, 143.0, 0.07074036869880167, 0.018928575218234038, 0.04034411652353532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 200.53333333333333, 126, 423, 130.0, 402.0, 423.0, 423.0, 0.07074337134610487, 0.01906754930812983, 0.04158936479526869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 201.59999999999997, 125, 420, 133.0, 404.40000000000003, 420.0, 420.0, 0.07074403863567763, 0.019067729163522486, 0.04165884306378282], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 10, 0, 0.0, 161.2, 128, 424, 131.0, 395.7000000000001, 424.0, 424.0, 0.05607550005327173, 0.04167329642630838, 0.03148770754944458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3063e055-3045-4195-a887-2d63ece81c13", 2, 0, 0.0, 229.0, 220, 238, 229.0, 238.0, 238.0, 238.0, 0.01638095550113438, 0.02799479699900895, 0.01018210759421097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 23, 0, 0.0, 726.3478260869566, 127, 2137, 131.0, 1966.8000000000004, 2128.7999999999997, 2137.0, 0.10341680118344791, 36.42964401154896, 0.05732009691952824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 420.8823529411764, 127, 1798, 140.0, 1506.7999999999997, 1798.0, 1798.0, 0.14113271456323576, 22.441585260244576, 0.08083025989174292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 23, 0, 0.0, 498.608695652174, 128, 1278, 142.0, 1146.6000000000001, 1260.9999999999998, 1278.0, 0.10341540619773026, 11.915578252302117, 0.05742031533830327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 312.47058823529414, 126, 1076, 131.0, 1028.8, 1076.0, 1076.0, 0.14113037125589428, 7.354328940650528, 0.08096674044879458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae10bf24-8e9c-41d0-8455-5f1628ddff5a", 3, 0, 0.0, 313.3333333333333, 245, 443, 252.0, 443.0, 443.0, 443.0, 0.0916898438216327, 0.04148726657293927, 0.058798500106971484], "isController": false}, {"data": ["deleteBooks", 17, 6, 35.294117647058826, 325.5882352941176, 129, 924, 227.0, 730.3999999999999, 924.0, 924.0, 0.078971328762287, 0.017451901525075718, 0.05246004399167549], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 378.59999999999997, 260, 832, 283.0, 662.2, 832.0, 832.0, 0.07069735874667722, 0.1095670979794695, 0.1590000167906227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca5ce265-8ac3-4e9d-8bbb-c8997f255d6b", 3, 0, 0.0, 761.6666666666666, 432, 1416, 437.0, 1416.0, 1416.0, 1416.0, 0.08797395970792646, 0.03980592577930266, 0.0564155926512419], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=13cbe978-4aac-4b72-a353-f23c1c36dcb2", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 0.8174844457013575, 3.1196973981900453], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 429.7916666666666, 134, 939, 448.0, 797.0, 913.75, 939.0, 0.1065837681803042, 0.06546991229044076, 0.048191684245586765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 23, 0, 0.0, 130.91304347826087, 126, 141, 131.0, 133.0, 139.39999999999998, 141.0, 0.10341354627531384, 0.07685323116749398, 0.051908752720225895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 23, 0, 0.0, 207.6521739130435, 126, 393, 129.0, 392.0, 392.8, 393.0, 0.10329418633373004, 0.08834740529494982, 0.05551536220330991], "isController": false}, {"data": ["login", 24, 0, 0.0, 2195.6250000000005, 1250, 3258, 2169.0, 3165.5, 3235.75, 3258.0, 0.10558314892943087, 52.77006774093854, 0.23225199508158498], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=45eceeaf-1244-4395-b840-f15c86688ae7", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da9e9923-66d9-47dd-8cf5-f753ecca679e", 3, 0, 0.0, 533.0, 221, 1150, 228.0, 1150.0, 1150.0, 1150.0, 0.06923289947382996, 0.03132608407181759, 0.04439739972768393], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cd84c299-194b-44a2-9e22-6480bee5b6a8", 1, 0, 0.0, 682.0, 682, 682, 682.0, 682.0, 682.0, 682.0, 1.466275659824047, 0.26490331744868034, 1.010928335777126], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 172.0, 129, 494, 134.0, 406.7999999999999, 494.0, 494.0, 0.14328579616331208, 0.11599992677674387, 0.05093362285492734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea914d50-a1ff-4868-a0a6-f4b4d0c2a477", 3, 0, 0.0, 304.0, 235, 430, 247.0, 430.0, 430.0, 430.0, 0.06554225290570653, 0.02965616261032946, 0.04203067650528708], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 23, 0, 0.0, 885.9565217391304, 256, 2266, 276.0, 2096.4000000000005, 2258.0, 2266.0, 0.10323159784560143, 48.42381585222172, 0.2218348504824955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b8dcb447-2d90-4db6-8da2-8c827157e6ec", 3, 0, 0.0, 322.6666666666667, 217, 525, 226.0, 525.0, 525.0, 525.0, 0.02736751840465613, 0.02744769668123227, 0.01755013387277753], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 23, 13, 56.52173913043478, 745.0434782608697, 127, 2145, 142.0, 1793.8, 2077.7999999999993, 2145.0, 0.12264181125958473, 63.81082808884066, 0.16607571698802376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 383.9411764705883, 256, 643, 280.0, 572.5999999999999, 643.0, 643.0, 0.14727157745185518, 0.22824218107040448, 0.33121722936681885], "isController": false}, {"data": ["register", 25, 10, 40.0, 633.0799999999999, 148, 1106, 669.0, 992.4000000000001, 1079.3, 1106.0, 0.10314254712582979, 0.03199030563199564, 0.04653501637903648], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 157.15384615384616, 129, 390, 143.0, 291.9999999999999, 390.0, 390.0, 0.074012923795155, 0.05746120548549631, 0.026309281505309003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 617.9411764705883, 260, 1928, 513.0, 1634.3999999999996, 1928.0, 1928.0, 0.1409758848309948, 29.942782319758187, 0.31069277467492623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 469.20000000000005, 256, 1168, 510.0, 930.4000000000001, 1168.0, 1168.0, 0.09220895779288638, 7.4876435194007644, 0.20580727213629713], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 163.0, 128, 380, 132.5, 380.0, 380.0, 380.0, 0.042128322871466485, 0.031308255571470704, 0.02114644331634158], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 192.125, 126, 388, 129.5, 388.0, 388.0, 388.0, 0.04212987587485321, 0.011273033193075955, 0.024027194834877218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 196.75, 125, 393, 136.0, 393.0, 393.0, 393.0, 0.04212898843032655, 0.011355078912861454, 0.024767237338922447], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 235.875, 130, 422, 139.5, 422.0, 422.0, 422.0, 0.04206452698439406, 0.011337704538762462, 0.024770419698817988], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 6, 6, 100.0, 136.0, 129, 145, 134.5, 145.0, 145.0, 145.0, 0.05003335557038025, 0.014755931037358238, 0.03092882233989326], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1490.603448275862, 1012, 2437, 1444.5, 1960.4, 2118.5999999999995, 2437.0, 0.24726621618741074, 295.8163582056147, 0.48825418860443803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 10, 40.0, 633.0799999999999, 148, 1106, 669.0, 992.4000000000001, 1079.3, 1106.0, 0.10110487406376888, 0.03135830859634081, 0.04561567560298947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 235.0, 127, 392, 141.0, 392.0, 392.0, 392.0, 0.03366459292774232, 0.009073659812555547, 0.01982397415569201], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 132.6, 125, 140, 133.0, 140.0, 140.0, 140.0, 0.033667993185598176, 0.00907457628830576, 0.019793097556377058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 314.30769230769226, 127, 1431, 142.0, 1027.7999999999997, 1431.0, 1431.0, 0.07705804248861911, 5.352784360847994, 0.0447923026424981], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 258.8461538461538, 126, 1045, 131.0, 783.3999999999997, 1045.0, 1045.0, 0.07717240314863405, 1.7646810293908128, 0.044934141887399526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 153.0769230769231, 127, 394, 132.0, 293.5999999999999, 394.0, 394.0, 0.07716461586860646, 0.057345969410165544, 0.0387330200746716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 284.6, 129, 392, 380.0, 392.0, 392.0, 392.0, 0.03361028205748703, 0.00899337625366352, 0.01916836398591057], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7c968f4-abb9-4c83-aa2a-b0484bf28569", 3, 0, 0.0, 607.6666666666666, 398, 971, 454.0, 971.0, 971.0, 971.0, 0.0793629798153488, 0.03590968162217931, 0.05089357755085844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 213.92307692307693, 125, 425, 131.0, 423.8, 425.0, 425.0, 0.07703703703703704, 0.029513888888888888, 0.0434375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 243.8, 127, 421, 144.0, 421.0, 421.0, 421.0, 0.03366391295858665, 0.025017810313949656, 0.016897706309290567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0241fbf9-4179-4927-9ef5-510ff94c6ad5", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 1.3474090189873418, 2.517635812236287], "isController": false}, {"data": ["deleteAccount", 16, 6, 37.5, 415.875, 128, 1150, 440.0, 915.5000000000002, 1150.0, 1150.0, 0.0797909477169815, 0.017015965046577965, 0.05428161030599828], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 134.4, 128, 142, 134.0, 142.0, 142.0, 142.0, 0.03166500953116787, 0.024923825861446584, 0.01125592135678233], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 877.0416666666665, 750, 1664, 813.0, 1130.0, 1540.0, 1664.0, 0.10483920287259416, 0.0542624780492919, 0.0482219380400311], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 532.4, 265, 814, 508.0, 814.0, 814.0, 814.0, 0.03357777956859269, 0.05203900017124668, 0.0755172132289736], "isController": false}, {"data": ["addBook", 55, 20, 36.36363636363637, 1365.054545454545, 645, 4002, 1033.0, 2516.7999999999997, 2961.999999999996, 4002.0, 0.24868198547697204, 76.79457345528924, 0.9012425904072054], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da9e9923-66d9-47dd-8cf5-f753ecca679e", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 0.7958769273127753, 3.037238436123348], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 226.39655172413796, 126, 574, 140.0, 530.0, 560.15, 574.0, 0.248279168521626, 0.18451215551265368, 0.12001776212715318], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 841.7241379310344, 630, 1170, 786.5, 1112.0, 1145.8, 1170.0, 0.2481814291827129, 72.97358057873342, 0.12481780862216517], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 197.94827586206898, 127, 516, 132.5, 392.3, 420.3499999999999, 516.0, 0.24873594963525875, 0.44014603587801643, 0.12096728800620982], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1262.8275862068965, 874, 1876, 1238.5, 1563.0, 1694.5499999999997, 1876.0, 0.24785583337250594, 223.02111455266294, 0.12441201011080864], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae10bf24-8e9c-41d0-8455-5f1628ddff5a", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 0.7374043367346939, 2.814094387755102], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 135.8, 127, 143, 134.0, 143.0, 143.0, 143.0, 0.09565777474507203, 0.07146308367185557, 0.034003349616412326], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/13cbe978-4aac-4b72-a353-f23c1c36dcb2", 3, 0, 0.0, 637.3333333333334, 225, 872, 815.0, 872.0, 872.0, 872.0, 0.07045395833822597, 0.031878581409548856, 0.04518043552288579], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 20, 11.904761904761905, 200.1071428571428, 126, 1840, 135.0, 333.0999999999999, 413.4999999999995, 1675.7800000000007, 0.7120786338262782, 1.6879126307596777, 0.33593511580814567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 169.125, 129, 380, 140.5, 380.0, 380.0, 380.0, 0.04223329673114283, 0.03270605889433229, 0.015012617197398428], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3063e055-3045-4195-a887-2d63ece81c13", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6ba91b25-94eb-4da8-9a54-d25b57613897", 1, 0, 0.0, 576.0, 576, 576, 576.0, 576.0, 576.0, 576.0, 1.736111111111111, 0.31365288628472227, 1.196967230902778], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 150.9411764705882, 129, 385, 137.0, 192.19999999999982, 385.0, 385.0, 0.1396774273061154, 0.11335150594861514, 0.04965096048772071], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cd84c299-194b-44a2-9e22-6480bee5b6a8", 3, 0, 0.0, 372.3333333333333, 226, 590, 301.0, 590.0, 590.0, 590.0, 0.046060308296996866, 0.029612340132346617, 0.029537372182644475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 432.75, 265, 785, 397.0, 785.0, 785.0, 785.0, 0.04203468912720223, 0.06514555824694329, 0.09453700103510422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 512.7692307692308, 255, 1826, 510.0, 1320.7999999999995, 1826.0, 1826.0, 0.0769713548142622, 7.193537440643244, 0.17159547001373643], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45eceeaf-1244-4395-b840-f15c86688ae7", 3, 0, 0.0, 311.6666666666667, 217, 477, 241.0, 477.0, 477.0, 477.0, 0.02411943946422685, 0.024190101884532203, 0.015467218666838183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ea914d50-a1ff-4868-a0a6-f4b4d0c2a477", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 0.7753822424892703, 2.9590262875536477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 138.46666666666667, 130, 144, 141.0, 144.0, 144.0, 144.0, 0.07585066521033389, 0.06288790504255222, 0.026962541148985875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4094d895-1b1d-48b2-a6b3-6200bfd34e42", 1, 0, 0.0, 306.0, 306, 306, 306.0, 306.0, 306.0, 306.0, 3.2679738562091503, 1.0435814950980393, 1.9499336192810457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 23, 0, 0.0, 159.21739130434787, 130, 386, 137.0, 290.80000000000035, 386.0, 386.0, 0.10092588529553732, 0.07835554571284392, 0.035875998288648035], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ca5ce265-8ac3-4e9d-8bbb-c8997f255d6b", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 0.8029513888888888, 3.064236111111111], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 151.60000000000002, 126, 382, 136.0, 238.60000000000008, 382.0, 382.0, 0.09228724713294285, 0.06858456549625928, 0.04632387209602796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 180.6, 126, 380, 131.0, 379.4, 380.0, 380.0, 0.09228838273838089, 0.03393520740275881, 0.05211649947087994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 236.79999999999995, 127, 884, 137.0, 606.8000000000002, 884.0, 884.0, 0.09228838273838089, 5.559299563860485, 0.05372673948220065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 259.73333333333335, 128, 1039, 132.0, 659.8000000000002, 1039.0, 1039.0, 0.09228497600590624, 1.8322052456318445, 0.05381487826073582], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 17.857142857142858, 0.7446016381236039], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 7, 12.5, 0.5212211466865228], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 6, 10.714285714285714, 0.4467609828741623], "isController": false}, {"data": ["401/Unauthorized", 33, 58.92857142857143, 2.4571854058078926], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1343, 56, "401/Unauthorized", 33, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 7, "Test failed: code expected to contain /204/", 6, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 23, 13, "Test failed: code expected to contain /200/", 7, "Test failed: code expected to contain /204/", 6, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 6, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 20, "401/Unauthorized", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
