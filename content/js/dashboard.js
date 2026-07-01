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

    var data = {"OkPercent": 98.33597464342314, "KoPercent": 1.6640253565768621};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7159863945578231, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6ef0be46-8753-4415-aab6-20725b98f665"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/93413b7e-0c59-4cf1-8dbf-bb8912d41a47"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b8975cc0-60b5-4ada-8941-8da7c744f5af"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ca132a51-c5cb-4387-b7a0-3a25d541962b"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/134bca09-3f08-439c-8693-80868e97806e"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f46c222f-86d9-44e9-a62e-5218748ea0f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.1, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0c2a3f7b-9f8d-47ce-b040-96f735e00a77"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/8f15cd9a-cc9d-4439-ac0e-6351241ed039"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.32142857142857145, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8f15cd9a-cc9d-4439-ac0e-6351241ed039"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a66abd35-2b46-47ce-80af-21ba88afd445"], "isController": false}, {"data": [0.6136363636363636, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3a141ac4-eed5-4a28-961d-eaec555f33c4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/64de7f9e-e18f-4815-8f15-a7ab7ff872aa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b8975cc0-60b5-4ada-8941-8da7c744f5af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b708f855-1641-4de8-8355-56ccb3ec518c"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ed199193-911e-4ca5-8b63-d7b577fde757"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0625, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6738a4b3-78a6-4518-8a2a-620eb287671a"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7d2eb99e-6e4d-453f-a7ac-84c939a8e396"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c7186743-488e-420c-a989-44faa731f80e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b708f855-1641-4de8-8355-56ccb3ec518c"], "isController": false}, {"data": [0.14545454545454545, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6ef0be46-8753-4415-aab6-20725b98f665"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=93413b7e-0c59-4cf1-8dbf-bb8912d41a47"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.20454545454545456, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=134bca09-3f08-439c-8693-80868e97806e"], "isController": false}, {"data": [0.2545454545454545, 500, 1500, "addBook"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9303030303030303, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c2a3f7b-9f8d-47ce-b040-96f735e00a77"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a66abd35-2b46-47ce-80af-21ba88afd445"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3a141ac4-eed5-4a28-961d-eaec555f33c4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=64de7f9e-e18f-4815-8f15-a7ab7ff872aa"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/55173c6c-950f-4a40-a7c3-1355fff697ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7d2eb99e-6e4d-453f-a7ac-84c939a8e396"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6738a4b3-78a6-4518-8a2a-620eb287671a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1262, 21, 1.6640253565768621, 504.6109350237719, 140, 2902, 159.0, 1469.2000000000003, 1751.85, 2350.37, 5.0111977636239455, 715.8460027371483, 3.6573823713646973], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/6ef0be46-8753-4415-aab6-20725b98f665", 3, 0, 0.0, 350.6666666666667, 288, 458, 306.0, 458.0, 458.0, 458.0, 0.05265374894692502, 0.033371370182181975, 0.033765587703594495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/93413b7e-0c59-4cf1-8dbf-bb8912d41a47", 3, 0, 0.0, 433.3333333333333, 251, 546, 503.0, 546.0, 546.0, 546.0, 0.018135216171776766, 0.02500085953368314, 0.011629679641406324], "isController": false}, {"data": ["see books", 55, 0, 0.0, 2501.218181818182, 1777, 3294, 2431.0, 3060.7999999999997, 3150.1999999999994, 3294.0, 0.2518834008838818, 303.10249060446296, 1.2385087143069773], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b8975cc0-60b5-4ada-8941-8da7c744f5af", 3, 0, 0.0, 627.0, 441, 962, 478.0, 962.0, 962.0, 962.0, 0.07448234768359899, 0.033701322682357614, 0.047763745096578776], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 504.2142857142857, 150, 847, 503.5, 800.0, 847.0, 847.0, 0.07391841518917834, 0.01456093781349328, 0.04973612115756238], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 504.2142857142857, 150, 847, 503.5, 800.0, 847.0, 847.0, 0.07617720995527309, 0.015005890130698326, 0.05125595474529605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 181.17647058823528, 141, 432, 148.0, 431.2, 432.0, 432.0, 0.1414886268112625, 0.050359807658696146, 0.07999374224933625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 166.76470588235296, 142, 464, 147.0, 226.3999999999998, 464.0, 464.0, 0.1414874492309741, 0.10514838756325322, 0.0710200672897663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 229.76470588235293, 141, 978, 147.0, 546.7999999999996, 978.0, 978.0, 0.14148980441115272, 2.483110304827299, 0.08260345141489804], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca132a51-c5cb-4387-b7a0-3a25d541962b", 1, 0, 0.0, 848.0, 848, 848, 848.0, 848.0, 848.0, 848.0, 1.1792452830188678, 0.37657539799528306, 0.7036317069575472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 282.7647058823529, 142, 1597, 148.0, 672.1999999999991, 1597.0, 1597.0, 0.14149333732843933, 7.525067274359742, 0.08246733688731303], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/134bca09-3f08-439c-8693-80868e97806e", 3, 0, 0.0, 1091.0, 272, 2673, 328.0, 2673.0, 2673.0, 2673.0, 0.022495669583605157, 0.022561574865588373, 0.014425933945215545], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 276.78571428571433, 148, 533, 245.0, 487.0, 533.0, 533.0, 0.07398208576637515, 0.13959887012180622, 0.04781794131635268], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f46c222f-86d9-44e9-a62e-5218748ea0f4", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 1.2329572876447876, 2.303782577220077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 163.72222222222223, 141, 436, 147.5, 185.8000000000004, 436.0, 436.0, 0.10595340404742004, 0.07874076218758462, 0.053183642265990136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 227.61111111111111, 140, 450, 149.0, 441.90000000000003, 450.0, 450.0, 0.10595465140919687, 0.03719219805867533, 0.059932899066421796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 1001.2, 839, 1314, 875.0, 1314.0, 1314.0, 1314.0, 0.05505698397841766, 16.18858135357595, 0.03139968617519132], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1553.0, 1303, 1748, 1584.0, 1748.0, 1748.0, 1748.0, 0.05494143243302639, 49.43639747997385, 0.03128013194184999], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c2a3f7b-9f8d-47ce-b040-96f735e00a77", 3, 0, 0.0, 341.6666666666667, 225, 550, 250.0, 550.0, 550.0, 550.0, 0.024422410003419135, 0.028866461823702765, 0.01566150641495303], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 381.8, 142, 445, 440.0, 445.0, 445.0, 445.0, 0.055467423981895435, 0.0981513400929634, 0.030712919333725303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 147.37499999999997, 141, 157, 146.5, 154.9, 157.0, 157.0, 0.0811247952866494, 0.060289032434707214, 0.040720844509118934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 182.37500000000003, 140, 442, 148.0, 430.1, 442.0, 442.0, 0.08112932013629726, 0.021708431364595163, 0.046269065390232025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 163.9375, 140, 438, 146.5, 242.0000000000002, 438.0, 438.0, 0.08112890876547153, 0.0218667761906935, 0.047694924879701034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 170.81250000000003, 140, 568, 145.0, 275.4000000000003, 568.0, 568.0, 0.08095363380623748, 0.021819534111837444, 0.047670938657383984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8f15cd9a-cc9d-4439-ac0e-6351241ed039", 3, 0, 0.0, 1030.6666666666667, 264, 2307, 521.0, 2307.0, 2307.0, 2307.0, 0.03862395715315686, 0.024831482870275003, 0.02476861835667937], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 148.0, 143, 155, 147.0, 155.0, 155.0, 155.0, 0.05564706406090014, 0.041354898193696296, 0.031247130698259358], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 1210.357142857143, 141, 1752, 1565.5, 1751.0, 1752.0, 1752.0, 0.10320069586754928, 66.33663848151234, 0.054335857450353096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 266.0555555555555, 141, 1442, 147.0, 540.2000000000014, 1442.0, 1442.0, 0.10595465140919687, 5.3235371727914345, 0.06178388635775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 867.6428571428572, 146, 1316, 998.5, 1294.0, 1316.0, 1316.0, 0.10319689229930047, 21.681741935899986, 0.05443463306133581], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 264.61111111111114, 142, 1118, 148.0, 522.200000000001, 1118.0, 1118.0, 0.10595776994213528, 1.7578113502846144, 0.06188917920990823], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 544.4615384615383, 154, 1151, 545.0, 941.7999999999998, 1151.0, 1151.0, 0.0745994582931644, 0.01413310049694716, 0.051023743070858], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8f15cd9a-cc9d-4439-ac0e-6351241ed039", 1, 0, 0.0, 628.0, 628, 628, 628.0, 628.0, 628.0, 628.0, 1.5923566878980893, 0.2876816281847134, 1.0978552945859872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 359.18749999999994, 287, 710, 299.5, 623.2, 710.0, 710.0, 0.0808914234868248, 0.1253659072984287, 0.18192670731460697], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a66abd35-2b46-47ce-80af-21ba88afd445", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 736.1818181818182, 193, 2020, 648.5, 1598.4999999999998, 1965.5499999999993, 2020.0, 0.10499038383529873, 0.06449116350820595, 0.047471238003655575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 188.57142857142856, 142, 443, 149.0, 434.5, 443.0, 443.0, 0.10319461029292527, 0.07669052581339467, 0.051798857119691004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 282.78571428571433, 142, 593, 148.0, 519.0, 593.0, 593.0, 0.10319765299052057, 0.13832631835001694, 0.052664204051245], "isController": false}, {"data": ["login", 22, 0, 0.0, 3217.6818181818185, 1696, 5611, 3167.0, 4974.199999999999, 5553.999999999999, 5611.0, 0.1034315776606598, 28.265346109385945, 0.19503610702347426], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3a141ac4-eed5-4a28-961d-eaec555f33c4", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/64de7f9e-e18f-4815-8f15-a7ab7ff872aa", 3, 0, 0.0, 453.0, 233, 874, 252.0, 874.0, 874.0, 874.0, 0.051357551271955355, 0.03361980325778067, 0.03293436718937241], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 170.61111111111114, 144, 467, 151.0, 206.0000000000004, 467.0, 467.0, 0.10896147606479575, 0.08821197622823797, 0.03873239969490787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b8975cc0-60b5-4ada-8941-8da7c744f5af", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 0.6642061121323529, 2.5347541360294117], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b708f855-1641-4de8-8355-56ccb3ec518c", 3, 0, 0.0, 325.0, 237, 483, 255.0, 483.0, 483.0, 483.0, 0.022383716592302986, 0.026456795230029993, 0.014354141174100547], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1423.3571428571427, 303, 1901, 1713.5, 1897.0, 1901.0, 1901.0, 0.10308139748923167, 88.13220764459007, 0.21299366325516328], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ed199193-911e-4ca5-8b63-d7b577fde757", 1, 0, 0.0, 529.0, 529, 529, 529.0, 529.0, 529.0, 529.0, 1.890359168241966, 0.6036596172022684, 1.1279389177693762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 485.52941176470586, 289, 1741, 307.0, 1072.1999999999994, 1741.0, 1741.0, 0.14131455789324932, 10.15091173866782, 0.31569289073475254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, 37.5, 1119.125, 148, 1896, 1566.5, 1896.0, 1896.0, 1896.0, 0.06217793771325089, 46.497757829562495, 0.10294425893613547], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6738a4b3-78a6-4518-8a2a-620eb287671a", 3, 0, 0.0, 440.6666666666667, 327, 533, 462.0, 533.0, 533.0, 533.0, 0.015899852131375177, 0.021919229744913372, 0.010196194237893587], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1265.181818181818, 322, 2902, 1153.5, 1898.1, 2755.5999999999976, 2902.0, 0.10813892903137012, 0.03419663220967155, 0.04878924337157519], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 151.7857142857143, 143, 178, 150.5, 168.0, 178.0, 178.0, 0.07317009433715733, 0.05680686034964852, 0.0260096819714114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 529.9444444444445, 289, 1879, 570.5, 739.6000000000018, 1879.0, 1879.0, 0.10586180329700705, 7.190923737965572, 0.23658091370498668], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d2eb99e-6e4d-453f-a7ac-84c939a8e396", 3, 0, 0.0, 365.3333333333333, 239, 583, 274.0, 583.0, 583.0, 583.0, 0.03411533256763365, 0.028440549057848232, 0.021877345429114025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 716.9285714285714, 287, 2043, 570.5, 1973.0, 2043.0, 2043.0, 0.0658600380106505, 11.343417612620664, 0.14571349648589654], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c7186743-488e-420c-a989-44faa731f80e", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 1.247406005859375, 2.330780029296875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 184.5, 142, 444, 148.5, 444.0, 444.0, 444.0, 0.04428722479641716, 0.03291267389655611, 0.022230110884139082], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 144.125, 140, 149, 143.5, 149.0, 149.0, 149.0, 0.04428845067927411, 0.011850620591915145, 0.02525825702802352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 201.0, 141, 586, 147.0, 586.0, 586.0, 586.0, 0.044289921828287976, 0.011937517992780743, 0.02603762982483336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 197.25, 141, 568, 145.0, 568.0, 568.0, 568.0, 0.044289921828287976, 0.011937517992780743, 0.026080881701618798], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 154.0, 154, 154, 154.0, 154.0, 154.0, 154.0, 6.493506493506494, 1.9150771103896105, 4.014052353896104], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b708f855-1641-4de8-8355-56ccb3ec518c", 1, 0, 0.0, 1151.0, 1151, 1151, 1151.0, 1151.0, 1151.0, 1151.0, 0.8688097306689835, 0.15696269548218938, 0.599003583840139], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1742.4545454545455, 1122, 2675, 1684.0, 2410.2, 2538.5999999999995, 2675.0, 0.249154008888003, 298.07481457845404, 0.49198184176908405], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1265.181818181818, 322, 2902, 1153.5, 1898.1, 2755.5999999999976, 2902.0, 0.10392702433309557, 0.032864707091129826, 0.04688895043153335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6ef0be46-8753-4415-aab6-20725b98f665", 1, 0, 0.0, 547.0, 547, 547, 547.0, 547.0, 547.0, 547.0, 1.8281535648994516, 0.3302816499085923, 1.2604261882998171], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 176.55555555555554, 140, 420, 143.0, 420.0, 420.0, 420.0, 0.04726890756302521, 0.012740447741596638, 0.027835108652836133], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=93413b7e-0c59-4cf1-8dbf-bb8912d41a47", 1, 0, 0.0, 597.0, 597, 597, 597.0, 597.0, 597.0, 597.0, 1.6750418760469012, 0.3026198701842546, 1.1548628559463987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 208.55555555555554, 141, 423, 147.0, 423.0, 423.0, 423.0, 0.04727089373503088, 0.012740983077020044, 0.02779011526219589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 312.92857142857144, 141, 1532, 145.0, 1049.5, 1532.0, 1532.0, 0.07472923995025169, 4.821667551296286, 0.04347390214739809], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 258.7857142857143, 140, 1174, 147.0, 799.0, 1174.0, 1174.0, 0.07487231596117336, 1.5912351759499423, 0.0436302544321737], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 178.33333333333334, 141, 443, 146.0, 443.0, 443.0, 443.0, 0.04727064545440221, 0.012648590678228716, 0.02695903998571376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 146.4285714285714, 141, 149, 147.0, 149.0, 149.0, 149.0, 0.07528500752850076, 0.0559491120402237, 0.03778954479457948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 211.22222222222223, 141, 440, 149.0, 440.0, 440.0, 440.0, 0.04726841104610246, 0.03512818438094138, 0.02372652663837565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 226.28571428571425, 140, 440, 147.0, 439.5, 440.0, 440.0, 0.07528824642918604, 0.028222589028351404, 0.04248618259013079], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 182.44444444444446, 150, 425, 151.0, 425.0, 425.0, 425.0, 0.050301529725409536, 0.03959280562371102, 0.017880621894579174], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 762.3076923076924, 150, 2673, 521.0, 2186.2, 2673.0, 2673.0, 0.07295296778284707, 0.013667720977345298, 0.04965098318153504], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1597.8636363636363, 1016, 2691, 1597.0, 2116.6, 2616.449999999999, 2691.0, 0.10757472776259236, 0.055678325892748, 0.04948017263298926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 424.8888888888889, 289, 871, 298.0, 871.0, 871.0, 871.0, 0.04723144984807217, 0.07319952237196342, 0.10622463769542013], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=134bca09-3f08-439c-8693-80868e97806e", 1, 0, 0.0, 623.0, 623, 623, 623.0, 623.0, 623.0, 623.0, 1.6051364365971108, 0.2899904695024077, 1.1066663322632424], "isController": false}, {"data": ["addBook", 55, 10, 18.181818181818183, 1430.745454545454, 747, 3161, 1147.0, 2439.2, 2608.199999999999, 3161.0, 0.26044132967137035, 86.01878155631452, 0.9450478043020172], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 264.69090909090903, 142, 604, 150.0, 580.0, 590.9999999999999, 604.0, 0.2518534121558194, 0.18716840493220563, 0.1217455459151666], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 913.4000000000001, 698, 1320, 862.0, 1193.0, 1296.8, 1320.0, 0.2515930413939169, 73.97670784501412, 0.12653360968541721], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 213.76363636363638, 140, 590, 148.0, 440.8, 448.3999999999999, 590.0, 0.25202883209839205, 0.4459728942991078, 0.12256870936035082], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1472.8727272727272, 974, 2366, 1458.0, 1882.4, 2064.0, 2366.0, 0.2498489549499621, 224.81452885159197, 0.12541246371511766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 150.85714285714283, 144, 165, 150.0, 160.0, 165.0, 165.0, 0.06736858314245568, 0.050329068460916594, 0.023947426038919792], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 10, 6.0606060606060606, 210.4666666666666, 142, 1310, 153.0, 344.4, 423.5999999999998, 1225.5200000000004, 0.6860450128685414, 1.5413680595112866, 0.327430574323622], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 153.625, 149, 166, 151.0, 166.0, 166.0, 166.0, 0.04357274742512295, 0.033743348347775884, 0.015488750061274176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c2a3f7b-9f8d-47ce-b040-96f735e00a77", 1, 0, 0.0, 604.0, 604, 604, 604.0, 604.0, 604.0, 604.0, 1.6556291390728477, 0.29911268625827814, 1.1414786837748345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 150.47058823529414, 144, 156, 150.0, 155.2, 156.0, 156.0, 0.14370002197765042, 0.1166159358041284, 0.05108086718736792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 387.875, 291, 1031, 296.0, 1031.0, 1031.0, 1031.0, 0.04425072460561542, 0.06857998041905436, 0.09952091676438701], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a66abd35-2b46-47ce-80af-21ba88afd445", 3, 0, 0.0, 1102.6666666666667, 239, 2350, 719.0, 2350.0, 2350.0, 2350.0, 0.039409902394808405, 0.025336769931558135, 0.025272626210212416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 503.5, 295, 1673, 298.0, 1195.0, 1673.0, 1673.0, 0.07466985258037677, 6.488250790367056, 0.1665696069698974], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a141ac4-eed5-4a28-961d-eaec555f33c4", 3, 0, 0.0, 689.0, 272, 1456, 339.0, 1456.0, 1456.0, 1456.0, 0.04529395778603134, 0.029119650594860647, 0.02904592996044328], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 208.49999999999997, 144, 467, 153.5, 449.5, 467.0, 467.0, 0.07944270939360387, 0.0658660744874704, 0.028239400604757627], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=64de7f9e-e18f-4815-8f15-a7ab7ff872aa", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.3598885707171315, 1.3734125996015936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/55173c6c-950f-4a40-a7c3-1355fff697ae", 1, 0, 0.0, 630.0, 630, 630, 630.0, 630.0, 630.0, 630.0, 1.5873015873015872, 0.5068824404761905, 0.9471106150793651], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 153.07142857142858, 144, 161, 153.5, 160.5, 161.0, 161.0, 0.09798089372572348, 0.07606915089057634, 0.03482914581656577], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7d2eb99e-6e4d-453f-a7ac-84c939a8e396", 1, 0, 0.0, 545.0, 545, 545, 545.0, 545.0, 545.0, 545.0, 1.834862385321101, 0.33149369266055045, 1.265051605504587], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6738a4b3-78a6-4518-8a2a-620eb287671a", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 205.5, 141, 440, 145.5, 431.0, 440.0, 440.0, 0.06590561374602802, 0.048978683653054016, 0.033081528774861715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 205.3571428571429, 140, 437, 145.0, 436.0, 437.0, 437.0, 0.06590778559255807, 0.03177696805355478, 0.03679728765923792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 487.0714285714286, 140, 1900, 283.5, 1829.5, 1900.0, 1900.0, 0.06590809586803316, 8.48725803784537, 0.03793761210260949], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 350.6428571428571, 140, 1177, 148.0, 1148.0, 1177.0, 1177.0, 0.06590778559255807, 2.78366607938122, 0.038001796575619765], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 23.80952380952381, 0.39619651347068147], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.523809523809524, 0.15847860538827258], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.761904761904762, 0.07923930269413629], "isController": false}, {"data": ["401/Unauthorized", 13, 61.904761904761905, 1.0301109350237718], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1262, 21, "401/Unauthorized", 13, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
