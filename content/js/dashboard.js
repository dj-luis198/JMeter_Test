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

    var data = {"OkPercent": 97.47399702823179, "KoPercent": 2.526002971768202};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7401399491094147, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9dc4bf96-6f15-46a6-b65e-ae19a164ce65"], "isController": false}, {"data": [0.017241379310344827, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3a19ac7c-cecb-45c9-ad4d-41bf987f29ee"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c754f845-4117-474a-a7c1-e35fe99bfff5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c202a516-39bb-4c72-95d3-b0f1bff8b43e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4867aaa3-3d00-49f3-b0de-22c5f7910474"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5d276bbf-0ef2-4deb-b39c-71776d468cb6"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/95a6d03d-4bc4-4174-a235-5d140ac57a65"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d18fc5ba-268a-4ba8-b097-69fa89870d61"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1616954a-5dad-4ed7-880a-c064b389186d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/014ec7ca-02f7-41b5-9ee8-912b07561ef2"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9dc4bf96-6f15-46a6-b65e-ae19a164ce65"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=012a27ba-4d6b-4e57-abc2-adc171d13189"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5071ec8d-e007-45aa-a80d-f40062b1ebe1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dddeb370-159a-4f94-a664-f50afc36d8e1"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "register"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/012a27ba-4d6b-4e57-abc2-adc171d13189"], "isController": false}, {"data": [0.8055555555555556, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.33620689655172414, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.13636363636363635, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/75c7b21f-4ff3-4f24-98e7-878b3142f43d"], "isController": false}, {"data": [0.25862068965517243, 500, 1500, "addBook"], "isController": true}, {"data": [0.9741379310344828, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5d276bbf-0ef2-4deb-b39c-71776d468cb6"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.45689655172413796, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=95a6d03d-4bc4-4174-a235-5d140ac57a65"], "isController": false}, {"data": [0.8936781609195402, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4867aaa3-3d00-49f3-b0de-22c5f7910474"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dddeb370-159a-4f94-a664-f50afc36d8e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=75c7b21f-4ff3-4f24-98e7-878b3142f43d"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/1616954a-5dad-4ed7-880a-c064b389186d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=014ec7ca-02f7-41b5-9ee8-912b07561ef2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c754f845-4117-474a-a7c1-e35fe99bfff5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d18fc5ba-268a-4ba8-b097-69fa89870d61"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5071ec8d-e007-45aa-a80d-f40062b1ebe1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1346, 34, 2.526002971768202, 440.1634472511141, 116, 5619, 134.0, 1222.0, 1514.3999999999978, 2025.9699999999987, 5.251473807006387, 750.2212790823282, 3.8465609991260545], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9dc4bf96-6f15-46a6-b65e-ae19a164ce65", 1, 0, 0.0, 975.0, 975, 975, 975.0, 975.0, 975.0, 975.0, 1.0256410256410255, 0.18529647435897437, 0.7071314102564102], "isController": false}, {"data": ["see books", 58, 0, 0.0, 2004.0689655172407, 1475, 2737, 1961.5, 2409.8, 2514.0, 2737.0, 0.25671327340406225, 308.9122729415358, 1.2622571597553258], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3a19ac7c-cecb-45c9-ad4d-41bf987f29ee", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 1.5206473214285714, 2.8413318452380953], "isController": false}, {"data": ["deleteBook", 17, 4, 23.529411764705884, 613.3529411764707, 122, 2068, 482.0, 1402.3999999999994, 2068.0, 2068.0, 0.09754921931933598, 0.02024617011723121, 0.06520465969667931], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, 23.529411764705884, 613.3529411764707, 122, 2068, 482.0, 1402.3999999999994, 2068.0, 2068.0, 0.0961473203176255, 0.01995520842759541, 0.06426759071782458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c754f845-4117-474a-a7c1-e35fe99bfff5", 3, 0, 0.0, 318.3333333333333, 241, 432, 282.0, 432.0, 432.0, 432.0, 0.07109341674960899, 0.03216791968813688, 0.04559050488174795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 202.4, 118, 368, 124.0, 366.8, 368.0, 368.0, 0.07389126161940089, 0.03456918007793065, 0.041313681952305656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 163.79999999999998, 121, 487, 123.0, 415.00000000000006, 487.0, 487.0, 0.07388907771653194, 0.0549117071701961, 0.037088853463181075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 264.73333333333335, 119, 957, 124.0, 810.6000000000001, 957.0, 957.0, 0.07389089762662437, 2.9141107599925125, 0.042665258531935646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 296.4666666666667, 120, 1561, 122.0, 1403.2, 1561.0, 1561.0, 0.07389016965182951, 8.882127553521114, 0.04259267982404288], "isController": false}, {"data": ["goToProfile", 17, 4, 23.529411764705884, 256.70588235294116, 121, 515, 241.0, 408.5999999999999, 515.0, 515.0, 0.0974927167205744, 0.16213316573188355, 0.0630051162170532], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c202a516-39bb-4c72-95d3-b0f1bff8b43e", 2, 0, 0.0, 350.0, 339, 361, 350.0, 361.0, 361.0, 361.0, 0.019006709368407048, 0.03214806701765723, 0.011814229016592858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 151.7777777777778, 120, 374, 122.5, 365.90000000000003, 374.0, 374.0, 0.10480532411046481, 0.07788755043756222, 0.05260735995388565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 162.94444444444446, 119, 374, 122.5, 356.90000000000003, 374.0, 374.0, 0.10481203708016956, 0.04553682687380631, 0.05879755118321144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 872.625, 712, 980, 950.0, 980.0, 980.0, 980.0, 0.10269840047241263, 30.196739646717504, 0.05857018151942284], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4867aaa3-3d00-49f3-b0de-22c5f7910474", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 0.456222380050505, 1.7410432449494948], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1306.4999999999998, 1067, 1504, 1315.0, 1504.0, 1504.0, 1504.0, 0.10209160168961601, 91.86220265821008, 0.05812441775883411], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 244.75, 121, 368, 244.5, 368.0, 368.0, 368.0, 0.10381116748634234, 0.18369710496606673, 0.057481378871832134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 142.15384615384616, 121, 360, 124.0, 267.9999999999999, 360.0, 360.0, 0.06263460417339185, 0.04654778689057735, 0.031439635297972085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 158.46153846153845, 119, 366, 121.0, 362.8, 366.0, 366.0, 0.06263581130239125, 0.016759972946147655, 0.03572198613339501], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 176.84615384615384, 119, 365, 123.0, 362.2, 365.0, 365.0, 0.06263701847792046, 0.016882633886627, 0.0368237159411212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 140.23076923076923, 117, 364, 123.0, 267.9999999999999, 364.0, 364.0, 0.06263581130239125, 0.01688230851509764, 0.03688417403841984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 155.25, 120, 367, 124.5, 367.0, 367.0, 367.0, 0.10379904504878555, 0.07713972000207597, 0.058285596585011416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 303.61111111111114, 119, 1458, 123.5, 1334.7000000000003, 1458.0, 1458.0, 0.10481081647626035, 10.50388391401437, 0.060616498678219145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 1017.9333333333335, 119, 1698, 1332.0, 1613.4, 1698.0, 1698.0, 0.08866715532121155, 53.1965410019093, 0.04704670025181472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 211.7777777777778, 119, 729, 123.5, 621.9000000000002, 729.0, 729.0, 0.10480959590078025, 3.449277432456038, 0.06071814588913473], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 707.6, 120, 1084, 954.0, 1082.2, 1084.0, 1084.0, 0.0886666312000142, 17.388588530675698, 0.04713301066068462], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 512.4666666666666, 120, 975, 522.0, 963.0, 975.0, 975.0, 0.09154491193379471, 0.01863081996777619, 0.0618106954209235], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5d276bbf-0ef2-4deb-b39c-71776d468cb6", 1, 0, 0.0, 761.0, 761, 761, 761.0, 761.0, 761.0, 761.0, 1.314060446780552, 0.23740349868593955, 0.9059830814717477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 339.53846153846155, 244, 725, 251.0, 630.5999999999999, 725.0, 725.0, 0.06259720623853388, 0.09701344365288404, 0.14078258395248391], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/95a6d03d-4bc4-4174-a235-5d140ac57a65", 3, 0, 0.0, 401.3333333333333, 334, 515, 355.0, 515.0, 515.0, 515.0, 0.0602990834539315, 0.02728376497427239, 0.038668357553465184], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 775.1818181818182, 125, 1972, 617.5, 1766.7999999999997, 1954.8999999999996, 1972.0, 0.10177457856072242, 0.06251582999481875, 0.04601721667345164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 140.6, 121, 373, 125.0, 226.60000000000008, 373.0, 373.0, 0.08866348660294718, 0.06589151689926055, 0.04450491417374497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 156.73333333333335, 120, 378, 123.0, 376.2, 378.0, 378.0, 0.0886666312000142, 0.11250733346928883, 0.045603280369798965], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d18fc5ba-268a-4ba8-b097-69fa89870d61", 3, 0, 0.0, 450.3333333333333, 382, 512, 457.0, 512.0, 512.0, 512.0, 0.017394732874885483, 0.023980043530319017, 0.0111548254438556], "isController": false}, {"data": ["login", 22, 0, 0.0, 3799.0, 1488, 6656, 3461.0, 5444.1, 6475.249999999997, 6656.0, 0.09948898837787727, 43.41406567969068, 0.21009806166056166], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 145.05555555555554, 122, 376, 130.0, 171.70000000000033, 376.0, 376.0, 0.10420767431628188, 0.08436343946113053, 0.03704257172961582], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1616954a-5dad-4ed7-880a-c064b389186d", 1, 0, 0.0, 831.0, 831, 831, 831.0, 831.0, 831.0, 831.0, 1.203369434416366, 0.21740561070998798, 0.829666817087846], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/014ec7ca-02f7-41b5-9ee8-912b07561ef2", 3, 0, 0.0, 585.3333333333333, 256, 1237, 263.0, 1237.0, 1237.0, 1237.0, 0.046189376443418015, 0.03805511451116243, 0.02962014049268668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1159.8666666666666, 241, 1823, 1459.0, 1736.6000000000001, 1823.0, 1823.0, 0.08860064146864423, 70.71055107199392, 0.18415204940667104], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9dc4bf96-6f15-46a6-b65e-ae19a164ce65", 3, 0, 0.0, 614.0, 217, 1318, 307.0, 1318.0, 1318.0, 1318.0, 0.024187696525034264, 0.024258558917197453, 0.015510990284608563], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=012a27ba-4d6b-4e57-abc2-adc171d13189", 1, 0, 0.0, 522.0, 522, 522, 522.0, 522.0, 522.0, 522.0, 1.9157088122605364, 0.3460997365900383, 1.3207914272030652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 542.4666666666666, 244, 2049, 253.0, 1672.2000000000003, 2049.0, 2049.0, 0.0738443361394181, 11.878318187552306, 0.16355847394525674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 7, 46.666666666666664, 838.7333333333331, 121, 1819, 1189.0, 1704.4, 1819.0, 1819.0, 0.1604175133146536, 102.37475987503475, 0.24233906112976708], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5071ec8d-e007-45aa-a80d-f40062b1ebe1", 3, 0, 0.0, 646.0, 297, 1092, 549.0, 1092.0, 1092.0, 1092.0, 0.04016601954746284, 0.025822880405676797, 0.025757506024902933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dddeb370-159a-4f94-a664-f50afc36d8e1", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 1202.375, 296, 1973, 1240.0, 1751.5, 1925.25, 1973.0, 0.09699556245301777, 0.030311113266568056, 0.043761669778607626], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/012a27ba-4d6b-4e57-abc2-adc171d13189", 3, 0, 0.0, 805.0, 335, 1629, 451.0, 1629.0, 1629.0, 1629.0, 0.05780680964217585, 0.03716420867294834, 0.03707012206871303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 499.7222222222221, 241, 1687, 263.0, 1591.6000000000001, 1687.0, 1687.0, 0.10473031942747425, 14.065818278349916, 0.2325635836678885], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 144.14285714285714, 124, 360, 126.5, 247.5, 360.0, 360.0, 0.08432363410770538, 0.0654661026519783, 0.029974416811723397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 395.99999999999994, 242, 734, 260.0, 725.0, 734.0, 734.0, 0.14818743370562176, 0.22966157938556808, 0.3332770115469208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 124.55555555555556, 120, 134, 124.0, 134.0, 134.0, 134.0, 0.04343901885736074, 0.032282317725050316, 0.02180435126238615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 176.33333333333334, 122, 367, 123.0, 367.0, 367.0, 367.0, 0.043390431927644045, 0.011610330418139128, 0.024746105708734492], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 147.66666666666666, 119, 359, 122.0, 359.0, 359.0, 359.0, 0.04344258338562533, 0.01170913380315683, 0.025539487498189895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 203.00000000000003, 120, 369, 123.0, 369.0, 369.0, 369.0, 0.043392523950262524, 0.011695641220969196, 0.025552433537117485], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 124.0, 120, 129, 123.0, 129.0, 129.0, 129.0, 0.07354383212394587, 0.02168968486467935, 0.04546215403755638], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1372.4827586206895, 953, 2191, 1269.0, 1877.8000000000002, 1984.2999999999997, 2191.0, 0.2558842344429003, 306.12650414708935, 0.5052714082456489], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 1202.375, 296, 1973, 1240.0, 1751.5, 1925.25, 1973.0, 0.0969936024636375, 0.03031050076988672, 0.04376078548652395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 13, 0, 0.0, 139.84615384615387, 120, 353, 122.0, 261.79999999999995, 353.0, 353.0, 0.05957208910151542, 0.01605653964064283, 0.035080048562708785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 13, 0, 0.0, 121.15384615384613, 118, 125, 121.0, 124.6, 125.0, 125.0, 0.05957236208998176, 0.016056613219565394, 0.03502203318180568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 173.50000000000003, 120, 363, 123.0, 362.0, 363.0, 363.0, 0.0837145334409663, 0.022563682841510446, 0.04921498938619308], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 155.7142857142857, 117, 363, 122.0, 361.0, 363.0, 363.0, 0.0837165358097482, 0.022564222542471195, 0.04929792098952945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 13, 0, 0.0, 122.3076923076923, 118, 125, 123.0, 125.0, 125.0, 125.0, 0.05957127015112773, 0.015939968770907226, 0.03397424000806503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 124.07142857142857, 117, 133, 124.0, 131.0, 133.0, 133.0, 0.08371353229249508, 0.06221288874471558, 0.04202026913900632], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 13, 0, 0.0, 122.07692307692308, 119, 125, 122.0, 125.0, 125.0, 125.0, 0.059571816115551, 0.04427163287493585, 0.029902259261126184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 122.85714285714286, 119, 127, 122.5, 126.0, 127.0, 127.0, 0.08371403286373746, 0.022400043949867256, 0.04774315936760028], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 13, 0, 0.0, 187.1538461538462, 125, 377, 133.0, 374.6, 377.0, 377.0, 0.06223996859275431, 0.04898966277906248, 0.022124363835705634], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 618.4, 123, 1318, 515.0, 1269.4, 1318.0, 1318.0, 0.09061418293191251, 0.017945855760343608, 0.06166011979194983], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 2110.181818181818, 1099, 5619, 1806.5, 3936.4999999999995, 5383.499999999996, 5619.0, 0.10100870970555961, 0.052279898578072845, 0.04646006081183455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 13, 0, 0.0, 263.92307692307696, 243, 478, 247.0, 387.19999999999993, 478.0, 478.0, 0.0595377125610834, 0.0922718260101947, 0.13390171096501474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/75c7b21f-4ff3-4f24-98e7-878b3142f43d", 3, 0, 0.0, 302.3333333333333, 209, 426, 272.0, 426.0, 426.0, 426.0, 0.018398022825813654, 0.02536315972243516, 0.01179821125223076], "isController": false}, {"data": ["addBook", 58, 12, 20.689655172413794, 1287.7931034482763, 616, 3033, 1046.0, 2335.3, 2773.7, 3033.0, 0.27851942913121147, 81.55635261400089, 1.0126576651067978], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 213.8103448275862, 121, 518, 125.0, 497.1, 503.34999999999997, 518.0, 0.2568542440735312, 0.19088484349605198, 0.1241629402503886], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 782.6551724137929, 591, 1231, 725.0, 1005.0000000000001, 1102.6, 1231.0, 0.2567735080573756, 75.49993705175315, 0.12913902016557463], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d276bbf-0ef2-4deb-b39c-71776d468cb6", 3, 0, 0.0, 394.6666666666667, 217, 623, 344.0, 623.0, 623.0, 623.0, 0.039202874877491016, 0.02484635331590983, 0.025139864423391046], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 178.1206896551724, 120, 537, 126.0, 368.2, 371.34999999999997, 537.0, 0.25731232836602236, 0.455322206053938, 0.12513822219363196], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1155.620689655172, 826, 1606, 1144.0, 1467.4, 1574.35, 1606.0, 0.2564918983938301, 230.79186103943343, 0.1287469099359655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 139.31578947368422, 123, 384, 125.0, 134.0, 384.0, 384.0, 0.14121459415668874, 0.10549723098619813, 0.05019737526663545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=95a6d03d-4bc4-4174-a235-5d140ac57a65", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 0.6666570571955719, 2.5441074723247232], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 12, 6.896551724137931, 213.14367816091956, 119, 1190, 129.0, 440.0, 547.25, 1171.25, 0.7536806906140765, 1.6916742445325665, 0.359510122440626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 129.11111111111111, 123, 146, 125.0, 146.0, 146.0, 146.0, 0.04370056373727221, 0.033842331097321154, 0.015534184765983481], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4867aaa3-3d00-49f3-b0de-22c5f7910474", 3, 0, 0.0, 422.66666666666663, 239, 704, 325.0, 704.0, 704.0, 704.0, 0.09346376721291047, 0.04228992071157082, 0.05993607467755001], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 129.20000000000002, 122, 151, 126.0, 146.2, 151.0, 151.0, 0.0781461645862421, 0.06341744411246795, 0.02777851944276575], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dddeb370-159a-4f94-a664-f50afc36d8e1", 3, 0, 0.0, 522.0, 221, 1103, 242.0, 1103.0, 1103.0, 1103.0, 0.032471398110164626, 0.0325665291593155, 0.020823129647468856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 356.1111111111111, 246, 494, 261.0, 494.0, 494.0, 494.0, 0.043362209352746754, 0.06720295531524326, 0.09752262513610915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 299.57142857142856, 242, 487, 249.5, 486.5, 487.0, 487.0, 0.08365100799464632, 0.12964272430420287, 0.1881330775504595], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=75c7b21f-4ff3-4f24-98e7-878b3142f43d", 1, 0, 0.0, 548.0, 548, 548, 548.0, 548.0, 548.0, 548.0, 1.8248175182481752, 0.3296789461678832, 1.2581261405109487], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1616954a-5dad-4ed7-880a-c064b389186d", 3, 0, 0.0, 1287.6666666666667, 515, 2823, 525.0, 2823.0, 2823.0, 2823.0, 0.024980848016520667, 0.029526516649735202, 0.016019619333510975], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=014ec7ca-02f7-41b5-9ee8-912b07561ef2", 1, 0, 0.0, 955.0, 955, 955, 955.0, 955.0, 955.0, 955.0, 1.0471204188481678, 0.18917702879581152, 0.721940445026178], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c754f845-4117-474a-a7c1-e35fe99bfff5", 1, 0, 0.0, 301.0, 301, 301, 301.0, 301.0, 301.0, 301.0, 3.3222591362126246, 0.6002128322259136, 2.290541943521595], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d18fc5ba-268a-4ba8-b097-69fa89870d61", 1, 0, 0.0, 534.0, 534, 534, 534.0, 534.0, 534.0, 534.0, 1.8726591760299625, 0.33832221441947563, 1.2911107209737827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 150.92307692307688, 123, 361, 133.0, 277.79999999999995, 361.0, 361.0, 0.06221107740015122, 0.05157930147727381, 0.022114093919585003], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 144.53333333333333, 122, 367, 125.0, 235.60000000000008, 367.0, 367.0, 0.08512521919743944, 0.06608842701363705, 0.030259355261589797], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5071ec8d-e007-45aa-a80d-f40062b1ebe1", 1, 0, 0.0, 818.0, 818, 818, 818.0, 818.0, 818.0, 818.0, 1.2224938875305624, 0.2208607121026895, 0.8428522310513448], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 162.05263157894737, 118, 373, 124.0, 367.0, 373.0, 373.0, 0.14833088717484308, 0.11023418470708553, 0.07445515235143489], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 186.3157894736842, 119, 366, 124.0, 365.0, 366.0, 366.0, 0.14862095399008152, 0.03976771620437728, 0.08476038782246836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 185.21052631578945, 116, 366, 123.0, 365.0, 366.0, 366.0, 0.1486221165353838, 0.040058304847427666, 0.08737354897880963], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 194.421052631579, 120, 511, 124.0, 365.0, 511.0, 511.0, 0.14862444168055133, 0.0400589315467111, 0.08752005696618403], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 23.529411764705884, 0.5943536404160475], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 11.764705882352942, 0.2971768202080238], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.823529411764707, 0.22288261515601784], "isController": false}, {"data": ["401/Unauthorized", 19, 55.88235294117647, 1.411589895988113], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1346, 34, "401/Unauthorized", 19, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
