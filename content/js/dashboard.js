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

    var data = {"OkPercent": 99.32885906040268, "KoPercent": 0.6711409395973155};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.825224071702945, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/335185cd-39a1-45a7-9f9c-0c725dd5b4c6"], "isController": false}, {"data": [0.35344827586206895, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b5dd9c26-8b25-491b-afb2-50e4c4d1c478"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f8452def-287d-44ea-9360-78b7ced1ee32"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6701afec-3ee2-4c73-abd4-7edce337aefa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e796d415-c06a-4e79-98eb-666db69361ed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9f81a2ba-cf2d-45e5-b883-af6fed327772"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9c6de582-fa74-4c47-b643-b3119de05312"], "isController": false}, {"data": [0.7608695652173914, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0c786bbf-0e16-4237-b0fa-3a7628df28e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=314121e2-a44a-4c05-b1ad-977d676c0743"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/64a8560a-119c-4824-acfa-50d1b7b3b86c"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fbefd741-7bfe-428f-a9f8-625dd1d9a33f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=335185cd-39a1-45a7-9f9c-0c725dd5b4c6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f7652d48-a901-41ed-a0f0-6e5a7860db1f"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0a936287-bbbf-45bd-9722-53a59ce553c2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6701afec-3ee2-4c73-abd4-7edce337aefa"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8322f0ff-359e-41ee-adbb-13e16edfaf11"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=64a8560a-119c-4824-acfa-50d1b7b3b86c"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f21493d9-5b03-48f0-b1d6-1f2191f757fb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b5dd9c26-8b25-491b-afb2-50e4c4d1c478"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f8452def-287d-44ea-9360-78b7ced1ee32"], "isController": false}, {"data": [0.391304347826087, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9c6de582-fa74-4c47-b643-b3119de05312"], "isController": false}, {"data": [0.38333333333333336, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/86981153-df1a-4044-a9d4-6c747e00aaac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d7b9918b-305a-41b8-9cba-e6f80b91901d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8275862068965517, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9f81a2ba-cf2d-45e5-b883-af6fed327772"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4a5b9116-4e17-4bb3-8453-3e6a40115416"], "isController": false}, {"data": [0.9662921348314607, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f7652d48-a901-41ed-a0f0-6e5a7860db1f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e796d415-c06a-4e79-98eb-666db69361ed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c786bbf-0e16-4237-b0fa-3a7628df28e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/314121e2-a44a-4c05-b1ad-977d676c0743"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d5a4a5b6-75f0-4f18-85ea-62365f80430a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8322f0ff-359e-41ee-adbb-13e16edfaf11"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fbefd741-7bfe-428f-a9f8-625dd1d9a33f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0a936287-bbbf-45bd-9722-53a59ce553c2"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1341, 9, 0.6711409395973155, 306.69276659209544, 77, 2190, 106.0, 863.1999999999998, 1025.3999999999992, 1398.4799999999996, 5.176566866883869, 751.5076040778009, 3.769298580738616], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/335185cd-39a1-45a7-9f9c-0c725dd5b4c6", 3, 0, 0.0, 517.0, 252, 913, 386.0, 913.0, 913.0, 913.0, 0.05058595396678189, 0.032521894233201246, 0.0324395603237501], "isController": false}, {"data": ["see books", 58, 0, 0.0, 1340.3103448275858, 959, 1765, 1315.5, 1619.8, 1719.6, 1765.0, 0.2544752544752545, 306.2197073671683, 1.2512528381669008], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b5dd9c26-8b25-491b-afb2-50e4c4d1c478", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 586.2857142857142, 383, 1036, 468.5, 1031.0, 1036.0, 1036.0, 0.07799660157664559, 0.014091182902030697, 0.0530133151341263], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 586.2857142857142, 383, 1036, 468.5, 1031.0, 1036.0, 1036.0, 0.07749663719949294, 0.01400085730654902, 0.05267349559653037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 131.18750000000003, 77, 247, 81.0, 247.0, 247.0, 247.0, 0.08127107968629363, 0.03700453213255313, 0.04549672502946076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 103.5, 79, 250, 84.0, 238.10000000000002, 250.0, 250.0, 0.08126942847274427, 0.0603965186208578, 0.04079344358885796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 208.375, 79, 644, 231.5, 515.9000000000001, 644.0, 644.0, 0.08120838070488874, 3.0038972092232417, 0.046948595095013805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 232.31250000000003, 79, 1007, 84.0, 834.1000000000001, 1007.0, 1007.0, 0.0812063198818448, 9.152850357688463, 0.046868100634931915], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 240.28571428571428, 177, 417, 219.0, 364.0, 417.0, 417.0, 0.07846566006434183, 0.15745675981661456, 0.050726823205658494], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f8452def-287d-44ea-9360-78b7ced1ee32", 1, 0, 0.0, 652.0, 652, 652, 652.0, 652.0, 652.0, 652.0, 1.5337423312883436, 0.277092120398773, 1.0574434432515336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 82.21052631578947, 78, 96, 82.0, 85.0, 96.0, 96.0, 0.0959048623765225, 0.07127304713723986, 0.048139745372590394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 128.3684210526316, 79, 326, 83.0, 242.0, 326.0, 326.0, 0.09590728289619803, 0.03324417741837785, 0.05427319000242292], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 551.75, 462, 643, 551.0, 643.0, 643.0, 643.0, 0.08312033746857013, 24.44013907071463, 0.0474045674625439], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 858.5, 692, 1093, 824.5, 1093.0, 1093.0, 1093.0, 0.0825951392760536, 74.31925150736129, 0.04702438105267505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 158.25, 81, 234, 159.0, 234.0, 234.0, 234.0, 0.08351951224604849, 0.14779038690414048, 0.046245667425302235], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6701afec-3ee2-4c73-abd4-7edce337aefa", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 102.81249999999999, 79, 246, 82.0, 243.9, 246.0, 246.0, 0.07570165975889022, 0.05625875300440962, 0.03799868468366169], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 109.62499999999999, 78, 237, 81.0, 236.3, 237.0, 237.0, 0.0757023761083301, 0.03446897740284073, 0.04237928428134788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 179.0, 78, 846, 81.5, 762.7, 846.0, 846.0, 0.0757023761083301, 8.532495023160195, 0.04369150808596005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 169.125, 79, 617, 82.0, 616.3, 617.0, 617.0, 0.0757023761083301, 2.8002301529661136, 0.043765436187628334], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e796d415-c06a-4e79-98eb-666db69361ed", 3, 0, 0.0, 260.3333333333333, 165, 391, 225.0, 391.0, 391.0, 391.0, 0.028910646827538355, 0.02899534598816591, 0.01853970515958677], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 80.5, 78, 82, 81.0, 82.0, 82.0, 82.0, 0.08378367056260735, 0.06226501298646894, 0.04704649470068284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 695.8571428571428, 79, 1192, 877.5, 1124.5, 1192.0, 1192.0, 0.08122816992933149, 52.21286249883959, 0.04276717540643095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 122.78947368421052, 77, 542, 81.0, 245.0, 542.0, 542.0, 0.0959082511382795, 4.566511465137351, 0.055949766160540315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 449.6428571428571, 79, 710, 556.0, 678.0, 710.0, 710.0, 0.08122675609345718, 17.065800380895467, 0.04284575401637299], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 103.63157894736842, 79, 488, 82.0, 95.0, 488.0, 488.0, 0.09590776701479503, 1.5087037087281117, 0.0560431436673111], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 636.0714285714287, 178, 2190, 534.0, 1618.0, 2190.0, 2190.0, 0.07762124160720324, 0.014023368845051369, 0.0535162075924663], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9f81a2ba-cf2d-45e5-b883-af6fed327772", 1, 0, 0.0, 741.0, 741, 741, 741.0, 741.0, 741.0, 741.0, 1.3495276653171389, 0.24381115047233468, 0.9304360661268556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 304.4375, 159, 1090, 167.5, 1008.8000000000001, 1090.0, 1090.0, 0.07567230110008609, 11.418915134105507, 0.16776859528561566], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c6de582-fa74-4c47-b643-b3119de05312", 3, 0, 0.0, 284.6666666666667, 172, 505, 177.0, 505.0, 505.0, 505.0, 0.03553912858056721, 0.02962750921055749, 0.02279039170042884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 565.0434782608695, 117, 1401, 491.0, 1042.8000000000002, 1333.199999999999, 1401.0, 0.10160716021240314, 0.06241299196640779, 0.04594151872885025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c786bbf-0e16-4237-b0fa-3a7628df28e9", 3, 0, 0.0, 564.3333333333334, 179, 813, 701.0, 813.0, 813.0, 813.0, 0.03085721338791632, 0.030947615380263728, 0.019787991658266647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 85.35714285714285, 81, 110, 83.0, 99.5, 110.0, 110.0, 0.08122534230679972, 0.0603637553666744, 0.04077131440009282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 152.0, 78, 250, 83.0, 249.5, 250.0, 250.0, 0.08122864121889378, 0.10887901574095026, 0.041452897541673195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=314121e2-a44a-4c05-b1ad-977d676c0743", 1, 0, 0.0, 590.0, 590, 590, 590.0, 590.0, 590.0, 590.0, 1.694915254237288, 0.3062102754237288, 1.168564618644068], "isController": false}, {"data": ["login", 23, 0, 0.0, 2314.4347826086955, 1503, 3453, 2243.0, 3185.4, 3400.5999999999995, 3453.0, 0.0995046399446235, 20.84185353079236, 0.17882697413960932], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 88.73684210526316, 82, 108, 86.0, 98.0, 108.0, 108.0, 0.09762714651265555, 0.07903603951073385, 0.034703399736920534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 782.2857142857141, 165, 1274, 962.5, 1207.0, 1274.0, 1274.0, 0.08118671785295925, 69.41276360312453, 0.16775341491631968], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/64a8560a-119c-4824-acfa-50d1b7b3b86c", 3, 0, 0.0, 283.6666666666667, 170, 438, 243.0, 438.0, 438.0, 438.0, 0.048993189946597425, 0.031051347925138407, 0.03141815891757713], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fbefd741-7bfe-428f-a9f8-625dd1d9a33f", 1, 0, 0.0, 2190.0, 2190, 2190, 2190.0, 2190.0, 2190.0, 2190.0, 0.45662100456621, 0.08249500570776255, 0.3148187785388128], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=335185cd-39a1-45a7-9f9c-0c725dd5b4c6", 1, 0, 0.0, 620.0, 620, 620, 620.0, 620.0, 620.0, 620.0, 1.6129032258064515, 0.2913936491935484, 1.1120211693548387], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7652d48-a901-41ed-a0f0-6e5a7860db1f", 3, 0, 0.0, 383.0, 268, 472, 409.0, 472.0, 472.0, 472.0, 0.11869905832080399, 0.053708232768853365, 0.076118862269526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 387.3125, 163, 1088, 326.5, 917.9000000000002, 1088.0, 1088.0, 0.08117089008954163, 12.24864966199934, 0.17995919260330262], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a936287-bbbf-45bd-9722-53a59ce553c2", 3, 0, 0.0, 295.6666666666667, 185, 448, 254.0, 448.0, 448.0, 448.0, 0.027942587297299815, 0.028024450346022373, 0.017918911775937706], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 939.75, 774, 1176, 904.5, 1176.0, 1176.0, 1176.0, 0.08245552555090599, 98.64547473768836, 0.18592754736039246], "isController": false}, {"data": ["register", 24, 5, 20.833333333333332, 931.1249999999999, 182, 1819, 930.0, 1572.5, 1772.5, 1819.0, 0.09713020708969569, 0.030780031445904545, 0.0438224176517963], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6701afec-3ee2-4c73-abd4-7edce337aefa", 3, 0, 0.0, 409.0, 361, 449, 417.0, 449.0, 449.0, 449.0, 0.0251127983191167, 0.020935506671633422, 0.016104235901256477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8322f0ff-359e-41ee-adbb-13e16edfaf11", 3, 0, 0.0, 386.0, 239, 608, 311.0, 608.0, 608.0, 608.0, 0.08172605426610004, 0.038415502070393376, 0.05240896058079983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 236.10526315789474, 161, 622, 169.0, 408.0, 622.0, 622.0, 0.09586566697276407, 6.176999004132315, 0.2143131776819682], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 86.46666666666667, 80, 101, 85.0, 95.60000000000001, 101.0, 101.0, 0.1184011113917656, 0.09192273784809926, 0.042087895065041674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=64a8560a-119c-4824-acfa-50d1b7b3b86c", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.45970499363867684, 1.754333651399491], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 264.84210526315786, 161, 1095, 170.0, 334.0, 1095.0, 1095.0, 0.08720036348783096, 5.618659687386697, 0.19494139647940006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 112.8, 80, 235, 82.5, 235.0, 235.0, 235.0, 0.05649717514124294, 0.04198667019774011, 0.028358933615819207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 112.70000000000002, 77, 241, 81.5, 240.5, 241.0, 241.0, 0.05654733294504165, 0.015130829323184974, 0.032249650820219064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 113.89999999999999, 79, 243, 82.0, 242.0, 243.0, 243.0, 0.056546373681055834, 0.01524101478122208, 0.033243082964839465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 127.80000000000001, 78, 243, 80.5, 242.8, 243.0, 243.0, 0.05654765270693613, 0.015241359518666378, 0.03329905720926024], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f21493d9-5b03-48f0-b1d6-1f2191f757fb", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 1.4715941820276497, 2.749675979262673], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 931.9827586206895, 621, 1405, 884.0, 1280.6, 1382.6499999999999, 1405.0, 0.25313472441047974, 302.83713426396713, 0.4998421999589747], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, 20.833333333333332, 931.1249999999999, 182, 1819, 930.0, 1572.5, 1772.5, 1819.0, 0.09712116674894987, 0.030777166611361557, 0.04381833890431137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 81.11111111111111, 77, 91, 80.0, 91.0, 91.0, 91.0, 0.04478636901977567, 0.01207132602486141, 0.02637322316301243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 117.22222222222223, 78, 241, 82.0, 241.0, 241.0, 241.0, 0.04475051587400244, 0.01206166248166472, 0.02630840874623971], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 266.0, 78, 961, 82.0, 958.0, 961.0, 961.0, 0.10893246187363834, 19.62701269744009, 0.062168096405228766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 212.39999999999998, 79, 640, 87.0, 625.6, 640.0, 640.0, 0.10893246187363834, 6.429440699891068, 0.06227447576252724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 115.77777777777777, 78, 236, 82.0, 236.0, 236.0, 236.0, 0.04475251857229521, 0.01197479500860243, 0.02552292074826211], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b5dd9c26-8b25-491b-afb2-50e4c4d1c478", 3, 0, 0.0, 272.0, 191, 372, 253.0, 372.0, 372.0, 372.0, 0.01760656372695741, 0.02081036226972082, 0.011290667494175162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 95.60000000000001, 80, 250, 82.0, 167.20000000000005, 250.0, 250.0, 0.10892929762388892, 0.08095233934744088, 0.05467740134636612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 104.88888888888889, 80, 282, 83.0, 282.0, 282.0, 282.0, 0.044785477562475744, 0.03328295744633207, 0.022480210417102083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 123.66666666666666, 79, 244, 82.0, 242.8, 244.0, 244.0, 0.10893246187363834, 0.06187023420479303, 0.060295819716775605], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 140.0, 81, 249, 91.0, 249.0, 249.0, 249.0, 0.04532612144378806, 0.03567661512079411, 0.016112019731971534], "isController": false}, {"data": ["deleteAccount", 14, 0, 0.0, 464.92857142857144, 361, 701, 426.5, 669.5, 701.0, 701.0, 0.07567240335553056, 0.013671283809348784, 0.05150748548711407], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f8452def-287d-44ea-9360-78b7ced1ee32", 3, 0, 0.0, 406.0, 271, 638, 309.0, 638.0, 638.0, 638.0, 0.021368586752900785, 0.025256946126231365, 0.013703162728910985], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1252.6521739130433, 650, 2158, 1216.0, 1784.8000000000002, 2097.999999999999, 2158.0, 0.1004910956150929, 0.0520119928476555, 0.046221978549520266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 223.22222222222223, 161, 519, 168.0, 519.0, 519.0, 519.0, 0.04473161033797217, 0.06932525938121273, 0.1006024400472167], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9c6de582-fa74-4c47-b643-b3119de05312", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["addBook", 60, 4, 6.666666666666667, 950.6333333333334, 407, 2030, 731.5, 1647.7, 1762.7499999999998, 2030.0, 0.26774837008179714, 102.49221960888656, 0.9695942440794141], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/86981153-df1a-4044-a9d4-6c747e00aaac", 1, 0, 0.0, 298.0, 298, 298, 298.0, 298.0, 298.0, 298.0, 3.3557046979865772, 1.071597105704698, 2.002280830536913], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7b9918b-305a-41b8-9cba-e6f80b91901d", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.6823417467948718, 1.274956597222222], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 148.60344827586204, 81, 349, 84.0, 332.1, 338.34999999999997, 349.0, 0.25396491781169817, 0.18873760005342022, 0.12276624444999082], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 519.7758620689657, 386, 740, 476.0, 663.5, 722.8499999999999, 740.0, 0.2536794454042469, 74.59017989918429, 0.12758292420233122], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f81a2ba-cf2d-45e5-b883-af6fed327772", 3, 0, 0.0, 259.0, 193, 390, 194.0, 390.0, 390.0, 390.0, 0.02302131774022745, 0.027210418201421185, 0.014763019514403671], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 130.67241379310343, 79, 321, 84.0, 245.0, 246.14999999999998, 321.0, 0.2541028853820744, 0.4496429963987488, 0.12357737980495413], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 782.0517241379309, 537, 1069, 740.5, 998.2, 1047.1, 1069.0, 0.25354747895118773, 228.1424672492066, 0.1272689493954204], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 86.78947368421052, 81, 122, 85.0, 91.0, 122.0, 122.0, 0.08677938852502444, 0.06483030490394892, 0.03084736076475478], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a5b9116-4e17-4bb3-8453-3e6a40115416", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 0.790435488861386, 1.4769299195544554], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 4, 2.247191011235955, 154.57303370786514, 79, 982, 87.5, 280.9999999999999, 425.7499999999998, 903.0000000000008, 0.7451315282731367, 1.6569152679752517, 0.3577753088319017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 117.0, 84, 246, 85.0, 245.6, 246.0, 246.0, 0.06003409936844127, 0.04649125078044329, 0.021340246259875607], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 87.25, 82, 108, 84.5, 99.60000000000001, 108.0, 108.0, 0.08165765030111258, 0.0662670970705318, 0.029026742880473615], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f7652d48-a901-41ed-a0f0-6e5a7860db1f", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 0.9458851439790575, 3.60970222513089], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e796d415-c06a-4e79-98eb-666db69361ed", 1, 0, 0.0, 1046.0, 1046, 1046, 1046.0, 1046.0, 1046.0, 1046.0, 0.9560229445506692, 0.17271898900573612, 0.6591330066921606], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c786bbf-0e16-4237-b0fa-3a7628df28e9", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.47418389107611547, 1.8095882545931758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 259.2, 162, 479, 167.5, 478.3, 479.0, 479.0, 0.05647101342880699, 0.08751904131984053, 0.12700463274076418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 394.1333333333334, 161, 1207, 194.0, 1108.6000000000001, 1207.0, 1207.0, 0.10885815057259388, 26.181405757870444, 0.2392540563268357], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/314121e2-a44a-4c05-b1ad-977d676c0743", 3, 0, 0.0, 474.3333333333333, 213, 795, 415.0, 795.0, 795.0, 795.0, 0.04917387883556255, 0.03161406598314975, 0.031534030373065826], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d5a4a5b6-75f0-4f18-85ea-62365f80430a", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 1.1915520055970148, 2.226416744402985], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 89.75, 79, 129, 84.5, 106.60000000000002, 129.0, 129.0, 0.07647013841095053, 0.06340151124111035, 0.02718274451326757], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 90.14285714285715, 83, 103, 86.5, 102.5, 103.0, 103.0, 0.08439785147183824, 0.0655237225782338, 0.03000079876538], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8322f0ff-359e-41ee-adbb-13e16edfaf11", 1, 0, 0.0, 178.0, 178, 178, 178.0, 178.0, 178.0, 178.0, 5.617977528089887, 1.014966643258427, 3.8733321629213484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 90.21052631578947, 79, 236, 82.0, 90.0, 236.0, 236.0, 0.08723439422600136, 0.06482946680272171, 0.04378757678922334], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fbefd741-7bfe-428f-a9f8-625dd1d9a33f", 3, 0, 0.0, 499.6666666666667, 201, 914, 384.0, 914.0, 914.0, 914.0, 0.04486182557722215, 0.028432934374626153, 0.028768813928101447], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 99.26315789473682, 79, 249, 82.0, 244.0, 249.0, 249.0, 0.08723639686132628, 0.030238603023888998, 0.04936640262351985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 172.47368421052633, 78, 858, 87.0, 244.0, 858.0, 858.0, 0.08723679739942515, 4.153634653727307, 0.050891121015803634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 126.89473684210526, 78, 468, 82.0, 244.0, 468.0, 468.0, 0.08723439422600136, 1.3722648143514353, 0.0509749089204055], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0a936287-bbbf-45bd-9722-53a59ce553c2", 1, 0, 0.0, 613.0, 613, 613, 613.0, 613.0, 613.0, 613.0, 1.6313213703099512, 0.29472114600326266, 1.124719616639478], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 55.55555555555556, 0.37285607755406414], "isController": false}, {"data": ["401/Unauthorized", 4, 44.44444444444444, 0.29828486204325133], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1341, 9, "406/Not Acceptable", 5, "401/Unauthorized", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
