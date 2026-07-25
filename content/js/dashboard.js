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

    var data = {"OkPercent": 98.71175523349436, "KoPercent": 1.288244766505636};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7330801104972375, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8c76f072-c905-4ab5-8d99-8efe8fbfc01b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cce21979-690a-4338-ae66-3d742b085ca5"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cc2faa4f-e01a-46ca-96d5-b8fc786ff562"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8387e2b9-6f85-4b04-9f4e-382ffdf09b9e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5263157894736842, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8383fa58-3148-40d4-adbc-5904df7cea25"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/be54865a-637a-4211-8431-22179239a9d1"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=54332a00-3c7d-4788-8221-637dfac2bed4"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6f9d2ca0-a212-476c-b525-56546ed4a6c9"], "isController": false}, {"data": [0.4473684210526316, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e2f457f4-9506-4f50-9fd4-12f77003739e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/17649c64-e67b-4767-b178-7e475f78bbdc"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4d706177-c46a-4701-8262-b68810b60e7c"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/44daae8a-766f-4bff-9eec-d8def04a8ac0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ddc97b75-2779-4b88-88ba-08ebde1d611a"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=17649c64-e67b-4767-b178-7e475f78bbdc"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8387e2b9-6f85-4b04-9f4e-382ffdf09b9e"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cc2faa4f-e01a-46ca-96d5-b8fc786ff562"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3ae7ecf3-d2e6-494a-87b6-b0bf01f5dd6b"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.27586206896551724, 500, 1500, "addBook"], "isController": true}, {"data": [0.9038461538461539, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9903846153846154, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3269230769230769, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/54332a00-3c7d-4788-8221-637dfac2bed4"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8383fa58-3148-40d4-adbc-5904df7cea25"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6f9d2ca0-a212-476c-b525-56546ed4a6c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/001a9288-971b-46b7-a625-a0814b883bb2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8c93c1b5-29e2-4403-8866-97cb22bbd5f7"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3ae7ecf3-d2e6-494a-87b6-b0bf01f5dd6b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1f199d70-b558-473e-a851-1a354bee8314"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8c76f072-c905-4ab5-8d99-8efe8fbfc01b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cce21979-690a-4338-ae66-3d742b085ca5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e2f457f4-9506-4f50-9fd4-12f77003739e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=44daae8a-766f-4bff-9eec-d8def04a8ac0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4d706177-c46a-4701-8262-b68810b60e7c"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1242, 16, 1.288244766505636, 490.6698872785838, 140, 2938, 164.0, 1342.3000000000004, 1679.0, 2240.479999999996, 4.863340903751272, 677.7337440468616, 3.5433563464249356], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 52, 0, 0.0, 2396.865384615385, 1720, 3189, 2331.5, 2960.5, 3076.0499999999997, 3189.0, 0.2263477484928287, 272.3724268926698, 1.1129501109974536], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8c76f072-c905-4ab5-8d99-8efe8fbfc01b", 3, 0, 0.0, 405.0, 246, 648, 321.0, 648.0, 648.0, 648.0, 0.022624263768749858, 0.022690545791509868, 0.01450839831524649], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cce21979-690a-4338-ae66-3d742b085ca5", 1, 0, 0.0, 640.0, 640, 640, 640.0, 640.0, 640.0, 640.0, 1.5625, 0.28228759765625, 1.0772705078125], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 574.0769230769231, 150, 1058, 525.0, 929.9999999999999, 1058.0, 1058.0, 0.07824161009196398, 0.014823117536954115, 0.052891845644349754], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 574.0769230769231, 150, 1058, 525.0, 929.9999999999999, 1058.0, 1058.0, 0.07664552036412518, 0.014520733350234653, 0.0518128784372568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 181.50000000000003, 142, 431, 146.5, 424.7, 431.0, 431.0, 0.08605666831608613, 0.031105199570792365, 0.048627480180073575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 165.3125, 143, 438, 147.0, 237.1000000000002, 438.0, 438.0, 0.08605527976033604, 0.06395319130626537, 0.04319571659844993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 313.81249999999994, 141, 1148, 146.5, 649.6000000000005, 1148.0, 1148.0, 0.08605620545919053, 1.6032065180852493, 0.0502134597283851], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 336.6875, 142, 2033, 148.0, 915.8000000000011, 2033.0, 2033.0, 0.08605342842237174, 4.8611835926365154, 0.05012780278705541], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 287.0769230769231, 147, 620, 251.0, 540.4, 620.0, 620.0, 0.07802512408995696, 0.1533950963460234, 0.05043616231926681], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/cc2faa4f-e01a-46ca-96d5-b8fc786ff562", 3, 0, 0.0, 330.3333333333333, 236, 515, 240.0, 515.0, 515.0, 515.0, 0.02359139700389258, 0.02366051242480242, 0.015128597688043094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 191.4, 142, 436, 147.5, 435.9, 436.0, 436.0, 0.1040967266784296, 0.07736094629129388, 0.05225167725850861], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 217.95000000000002, 141, 443, 146.0, 436.0, 442.65, 443.0, 0.1040983521230859, 0.043489526404547015, 0.05849432794103869], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 1005.0, 858, 1153, 1004.5, 1153.0, 1153.0, 1153.0, 0.16404872247057375, 48.23577133658697, 0.0935590370339991], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1237.25, 996, 1394, 1279.5, 1394.0, 1394.0, 1394.0, 0.16303904785196052, 146.7028218492704, 0.09282398915790332], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 296.75, 146, 456, 292.5, 456.0, 456.0, 456.0, 0.17110835436540187, 0.3027815801856526, 0.09474456730974891], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 145.72727272727272, 142, 149, 146.0, 148.8, 149.0, 149.0, 0.05124263387138099, 0.0380816839610556, 0.025721400204970536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8387e2b9-6f85-4b04-9f4e-382ffdf09b9e", 1, 0, 0.0, 2938.0, 2938, 2938, 2938.0, 2938.0, 2938.0, 2938.0, 0.3403675970047651, 0.0614921928182437, 0.23466750340367595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 144.9090909090909, 142, 148, 145.0, 148.0, 148.0, 148.0, 0.051242872582268104, 0.02070823472962397, 0.028833214348936015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 384.27272727272725, 141, 1907, 146.0, 1616.400000000001, 1907.0, 1907.0, 0.05117516794759663, 4.1986762859505555, 0.02968559546960195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 262.6363636363636, 141, 1160, 145.0, 1014.6000000000005, 1160.0, 1160.0, 0.05124406617006508, 1.3823250626575174, 0.029775604854676486], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 152.25, 146, 165, 149.0, 165.0, 165.0, 165.0, 0.17111567419575632, 0.12716701959274468, 0.09608546158453114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 935.9473684210527, 141, 1887, 1291.0, 1866.0, 1887.0, 1887.0, 0.09368189572711944, 44.37782085741122, 0.05083745143333301], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 330.9, 141, 1586, 147.0, 1454.4000000000024, 1585.15, 1586.0, 0.10410051946159211, 9.392235548896013, 0.06030510560997699], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 721.8421052631577, 146, 1318, 869.0, 1316.0, 1318.0, 1318.0, 0.09368235763979627, 14.509709991469975, 0.05092918877241597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 296.85, 141, 1008, 148.0, 822.4000000000009, 1000.8499999999999, 1008.0, 0.10410051946159211, 3.086153427249352, 0.0604067662735137], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8383fa58-3148-40d4-adbc-5904df7cea25", 3, 0, 0.0, 511.6666666666667, 229, 1058, 248.0, 1058.0, 1058.0, 1058.0, 0.028649737854898626, 0.023884107632290166, 0.018372390486377052], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be54865a-637a-4211-8431-22179239a9d1", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 1.27734375, 2.38671875], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 737.3846153846154, 150, 2938, 559.0, 2187.1999999999994, 2938.0, 2938.0, 0.07663829084820903, 0.0145193636958521, 0.05241824205025114], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=54332a00-3c7d-4788-8221-637dfac2bed4", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 0.7496434128630706, 2.8608013485477177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 532.0909090909091, 286, 2055, 294.0, 1764.600000000001, 2055.0, 2055.0, 0.051139956112619483, 5.633976006643545, 0.1138254474165024], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 607.952380952381, 156, 1157, 525.0, 988.6, 1140.3999999999996, 1157.0, 0.0866283027040406, 0.05321211171957181, 0.03916885171090898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 148.63157894736838, 143, 173, 148.0, 153.0, 173.0, 173.0, 0.09368097191543073, 0.06962033166761991, 0.047023456605987696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 207.4736842105263, 141, 441, 147.0, 439.0, 441.0, 441.0, 0.09368281955702819, 0.09912389614519851, 0.04928748668717827], "isController": false}, {"data": ["login", 21, 0, 0.0, 2818.8571428571427, 1744, 5178, 2562.0, 4033.2000000000007, 5076.699999999999, 5178.0, 0.08466137465883482, 19.409982344575827, 0.15447630010643146], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 151.6, 146, 169, 149.5, 166.00000000000003, 168.9, 169.0, 0.10175786715510443, 0.08238014831209138, 0.03617174184029103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f9d2ca0-a212-476c-b525-56546ed4a6c9", 3, 0, 0.0, 402.3333333333333, 264, 650, 293.0, 650.0, 650.0, 650.0, 0.0288711384852276, 0.024068680228081996, 0.01851436940621692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 1120.842105263158, 291, 2061, 1453.0, 2014.0, 2061.0, 2061.0, 0.09361219914763629, 59.01226716274974, 0.1979299463577464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e2f457f4-9506-4f50-9fd4-12f77003739e", 3, 0, 0.0, 427.3333333333333, 289, 572, 421.0, 572.0, 572.0, 572.0, 0.06881838827334663, 0.031900190397540884, 0.04413158362581148], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/17649c64-e67b-4767-b178-7e475f78bbdc", 3, 0, 0.0, 600.3333333333334, 249, 1072, 480.0, 1072.0, 1072.0, 1072.0, 0.021593608291945583, 0.02552291396746563, 0.013847463650759374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 575.125, 293, 2184, 578.0, 1266.3000000000009, 2184.0, 2184.0, 0.08598590905915293, 6.5542475779516005, 0.19200930595936092], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d706177-c46a-4701-8262-b68810b60e7c", 3, 0, 0.0, 393.33333333333337, 261, 656, 263.0, 656.0, 656.0, 656.0, 0.02651230612876143, 0.026589978900623038, 0.01700170672970704], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 976.0000000000001, 147, 1559, 1274.5, 1559.0, 1559.0, 1559.0, 0.10105433354667026, 80.606423371341, 0.17422990808266245], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44daae8a-766f-4bff-9eec-d8def04a8ac0", 3, 0, 0.0, 396.3333333333333, 249, 637, 303.0, 637.0, 637.0, 637.0, 0.01715246252186939, 0.02364605429040263, 0.010999463270860254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ddc97b75-2779-4b88-88ba-08ebde1d611a", 1, 0, 0.0, 330.0, 330, 330, 330.0, 330.0, 330.0, 330.0, 3.0303030303030303, 0.9676846590909091, 1.8081202651515151], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 1216.695652173913, 445, 1972, 1255.0, 1853.2, 1954.3999999999996, 1972.0, 0.09291164910097881, 0.0294136063050653, 0.041919122934230675], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=17649c64-e67b-4767-b178-7e475f78bbdc", 1, 0, 0.0, 1041.0, 1041, 1041, 1041.0, 1041.0, 1041.0, 1041.0, 0.9606147934678194, 0.17354857108549473, 0.6622988712776178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 597.3499999999999, 288, 2004, 448.0, 1646.400000000002, 1990.4499999999998, 2004.0, 0.10401768300611104, 12.589217510726824, 0.23127681705890002], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 175.76923076923075, 148, 449, 152.0, 335.7999999999999, 449.0, 449.0, 0.09006886804217995, 0.06992651376321588, 0.03201666793686865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8387e2b9-6f85-4b04-9f4e-382ffdf09b9e", 3, 0, 0.0, 462.3333333333333, 271, 689, 427.0, 689.0, 689.0, 689.0, 0.01970223357654646, 0.023287373084778712, 0.012634570359959808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 498.00000000000006, 291, 1402, 305.0, 982.7999999999996, 1402.0, 1402.0, 0.09128398986210748, 6.557114412399588, 0.2039259582805318], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cc2faa4f-e01a-46ca-96d5-b8fc786ff562", 1, 0, 0.0, 1061.0, 1061, 1061, 1061.0, 1061.0, 1061.0, 1061.0, 0.942507068803016, 0.1702771559849199, 0.6498144439208294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 157.27272727272728, 141, 249, 149.0, 231.00000000000006, 249.0, 249.0, 0.05164488973816041, 0.03838062606517585, 0.02592331379435005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 170.72727272727272, 140, 423, 145.0, 370.20000000000016, 423.0, 423.0, 0.051649497121714384, 0.013820275597021233, 0.02945635382722774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 171.63636363636363, 141, 431, 146.0, 374.8000000000002, 431.0, 431.0, 0.0516482845726574, 0.013920826701224064, 0.030363542297597412], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 171.54545454545453, 142, 421, 146.0, 367.4000000000002, 421.0, 421.0, 0.05164779956897563, 0.013920695977575465, 0.030413694472746396], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 150.0, 150, 150, 150.0, 150.0, 150.0, 150.0, 6.666666666666667, 1.9661458333333335, 4.12109375], "isController": false}, {"data": ["https://demoqa.com/books", 52, 0, 0.0, 1654.8846153846155, 1126, 2593, 1521.0, 2341.2, 2420.149999999999, 2593.0, 0.23907166632951432, 286.01282768909647, 0.4720731536311308], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 1216.695652173913, 445, 1972, 1255.0, 1853.2, 1954.3999999999996, 1972.0, 0.09039850017097108, 0.028618003450864484, 0.04078526081932484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 3, 0, 0.0, 146.66666666666666, 145, 149, 146.0, 149.0, 149.0, 149.0, 0.02533398638720465, 0.006828301018426252, 0.014918353311996486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 3, 0, 0.0, 147.0, 144, 150, 147.0, 150.0, 150.0, 150.0, 0.02533398638720465, 0.006828301018426252, 0.014893613090915232], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 313.2307692307692, 140, 1737, 147.0, 1216.5999999999995, 1737.0, 1737.0, 0.09130175229132283, 6.342213946781613, 0.05307188696140745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 323.30769230769226, 143, 1154, 147.0, 925.9999999999998, 1154.0, 1154.0, 0.09167712726195681, 2.0963567377399475, 0.05337961338697621], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 3, 0, 0.0, 147.66666666666666, 146, 149, 148.0, 149.0, 149.0, 149.0, 0.025333558520520185, 0.006778706088498564, 0.014448045093734166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 191.07692307692307, 141, 435, 148.0, 429.8, 435.0, 435.0, 0.09233413593005335, 0.06861941156520565, 0.04634740807426505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 3, 0, 0.0, 148.33333333333334, 146, 152, 147.0, 152.0, 152.0, 152.0, 0.025333130668287986, 0.01882667230328824, 0.012716044104980494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 168.76923076923075, 141, 440, 145.0, 329.19999999999993, 440.0, 440.0, 0.09233610341643582, 0.035375159812486685, 0.052063911676965696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 153.66666666666666, 149, 162, 150.0, 162.0, 162.0, 162.0, 0.025891308287807783, 0.020379291484348704, 0.009203550992931672], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 583.2307692307693, 149, 1058, 572.0, 910.3999999999999, 1058.0, 1058.0, 0.07747826138781447, 0.014515533646424975, 0.05273084796977156], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3ae7ecf3-d2e6-494a-87b6-b0bf01f5dd6b", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 0.7112758366141733, 2.714382381889764], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1610.8095238095236, 1098, 2935, 1487.0, 2529.0000000000005, 2907.4999999999995, 2935.0, 0.08698137356014762, 0.045019656237185776, 0.04000803412776321], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 0, 0.0, 297.3333333333333, 292, 303, 297.0, 303.0, 303.0, 303.0, 0.025301936441535656, 0.039213059699919034, 0.05690464807114905], "isController": false}, {"data": ["addBook", 58, 7, 12.068965517241379, 1506.344827586207, 739, 3172, 1179.5, 2670.7000000000003, 2754.2, 3172.0, 0.2601071820974505, 86.86083407376056, 0.9444388776150862], "isController": true}, {"data": ["https://demoqa.com/books-0", 52, 0, 0.0, 255.826923076923, 143, 619, 149.0, 585.0, 611.4, 619.0, 0.24015591661047633, 0.17847524662165282, 0.11609099484588456], "isController": false}, {"data": ["https://demoqa.com/books-3", 52, 0, 0.0, 975.5961538461539, 701, 1362, 878.5, 1265.4, 1312.35, 1362.0, 0.2400350820504535, 70.57828403766705, 0.12072076880467146], "isController": false}, {"data": ["https://demoqa.com/books-1", 52, 0, 0.0, 205.9038461538462, 141, 587, 149.0, 436.7, 442.7, 587.0, 0.2403535045389835, 0.4253130373287481, 0.11689066919962282], "isController": false}, {"data": ["https://demoqa.com/books-2", 52, 0, 0.0, 1394.846153846154, 979, 2098, 1331.0, 1751.3, 1843.2499999999989, 2098.0, 0.23975839730732876, 215.7350273474422, 0.12034747677340527], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 155.64705882352942, 148, 174, 154.0, 169.2, 174.0, 174.0, 0.08949488036640257, 0.06685896824247847, 0.03181263325524466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54332a00-3c7d-4788-8221-637dfac2bed4", 3, 0, 0.0, 576.6666666666666, 492, 620, 618.0, 620.0, 620.0, 620.0, 0.09099457065728411, 0.04117267357214353, 0.05835263808426097], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 7, 4.166666666666667, 229.77380952380963, 142, 1397, 156.5, 416.29999999999995, 571.0499999999998, 1044.4100000000012, 0.7171641281333242, 1.528671991058927, 0.3466259935711358], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 205.99999999999997, 144, 444, 155.0, 440.8, 444.0, 444.0, 0.05499697516636585, 0.04259043096379699, 0.01954970601616911], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8383fa58-3148-40d4-adbc-5904df7cea25", 1, 0, 0.0, 559.0, 559, 559, 559.0, 559.0, 559.0, 559.0, 1.7889087656529516, 0.3231915250447227, 1.2333687388193202], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6f9d2ca0-a212-476c-b525-56546ed4a6c9", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.34281605787476277, 1.3082601992409866], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 156.93750000000003, 148, 195, 153.0, 178.9, 195.0, 195.0, 0.08826855708493091, 0.07163200286872812, 0.031376713651284034], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/001a9288-971b-46b7-a625-a0814b883bb2", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 1.341747636554622, 2.5070575105042017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 357.0, 285, 580, 297.0, 577.4, 580.0, 580.0, 0.05160878663050924, 0.07998353943615055, 0.11606937071295192], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c93c1b5-29e2-4403-8866-97cb22bbd5f7", 1, 0, 0.0, 383.0, 383, 383, 383.0, 383.0, 383.0, 383.0, 2.6109660574412534, 0.8337752937336814, 1.557910411227154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 562.6153846153846, 288, 2159, 304.0, 1644.1999999999996, 2159.0, 2159.0, 0.0912088683084263, 8.52413746228864, 0.20333575606889778], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ae7ecf3-d2e6-494a-87b6-b0bf01f5dd6b", 3, 0, 0.0, 359.3333333333333, 267, 528, 283.0, 528.0, 528.0, 528.0, 0.07223867658744491, 0.03268611994028269, 0.04632493257723518], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f199d70-b558-473e-a851-1a354bee8314", 1, 0, 0.0, 543.0, 543, 543, 543.0, 543.0, 543.0, 543.0, 1.8416206261510129, 0.5880956491712707, 1.0988576197053406], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 179.36363636363637, 147, 445, 151.0, 390.0000000000002, 445.0, 445.0, 0.054165312533853316, 0.04490854525511862, 0.019254075939768172], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8c76f072-c905-4ab5-8d99-8efe8fbfc01b", 1, 0, 0.0, 496.0, 496, 496, 496.0, 496.0, 496.0, 496.0, 2.0161290322580645, 0.3642420614919355, 1.3900264616935485], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cce21979-690a-4338-ae66-3d742b085ca5", 3, 0, 0.0, 573.6666666666666, 251, 962, 508.0, 962.0, 962.0, 962.0, 0.050252939796978126, 0.03230779820932025, 0.03222600631511943], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 172.52631578947364, 144, 444, 155.0, 178.0, 444.0, 444.0, 0.09367496758353096, 0.0727261711219796, 0.03329852363320827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e2f457f4-9506-4f50-9fd4-12f77003739e", 1, 0, 0.0, 288.0, 288, 288, 288.0, 288.0, 288.0, 288.0, 3.472222222222222, 0.6273057725694445, 2.393934461805556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=44daae8a-766f-4bff-9eec-d8def04a8ac0", 1, 0, 0.0, 830.0, 830, 830, 830.0, 830.0, 830.0, 830.0, 1.2048192771084338, 0.2176675451807229, 0.8306664156626506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 180.8235294117647, 143, 433, 147.0, 425.0, 433.0, 433.0, 0.0913585554600172, 0.06789439521979793, 0.04585771240864144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 214.2941176470588, 142, 440, 147.0, 436.8, 440.0, 440.0, 0.09136199233634112, 0.03251831942302215, 0.05165353449990057], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 297.4117647058824, 144, 1259, 148.0, 602.1999999999994, 1259.0, 1259.0, 0.09136346536249798, 4.859000686905466, 0.053249869000913636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 274.8235294117647, 141, 1149, 147.0, 584.9999999999995, 1149.0, 1149.0, 0.09136199233634112, 1.603379873087444, 0.05333823116465043], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4d706177-c46a-4701-8262-b68810b60e7c", 1, 0, 0.0, 561.0, 561, 561, 561.0, 561.0, 561.0, 561.0, 1.7825311942959001, 0.32203932709447414, 1.2289717023172904], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 31.25, 0.4025764895330113], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.25, 0.08051529790660225], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.25, 0.08051529790660225], "isController": false}, {"data": ["401/Unauthorized", 9, 56.25, 0.7246376811594203], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1242, 16, "401/Unauthorized", 9, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
