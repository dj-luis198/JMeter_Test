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

    var data = {"OkPercent": 99.45736434108527, "KoPercent": 0.5426356589147286};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7767737617135207, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/437a7872-6e83-4a3e-b9cd-84291c77a232"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=735a4907-168d-4a58-b96f-88b4733e15b7"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f0ca123f-5cf5-4596-b5cf-50b145f4d10d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c05303e6-7ccf-48f6-a3e6-37a9a3ff09d9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f523845d-2142-47ec-8cd6-d741c90320c6"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/09834644-397b-48fa-b0ca-330822e9f637"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/64cc9872-f3f0-490c-b2bc-4812318c801b"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/70f77f99-5379-40a0-ac2c-53d9d344b350"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2760167b-8a24-453b-98e9-a4e109c79280"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d9114147-7c19-48ee-a3a7-c63161905195"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/68801efb-faec-414f-8593-9c81c9e6d859"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d676aa52-7e2d-4f08-9244-b2195cbecdb4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f523845d-2142-47ec-8cd6-d741c90320c6"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=324fe44a-8477-4c34-9dab-eb9d8dfdc301"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/220a373e-201e-4cab-b4d3-8168f3210af8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eb60b663-456d-4adb-ab90-482f560fcca8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/47b071d3-0cda-446d-ac53-39f60c5786f2"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "register"], "isController": true}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c05303e6-7ccf-48f6-a3e6-37a9a3ff09d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f0ca123f-5cf5-4596-b5cf-50b145f4d10d"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.35454545454545455, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=437a7872-6e83-4a3e-b9cd-84291c77a232"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/735a4907-168d-4a58-b96f-88b4733e15b7"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2768b2fb-1629-4b42-9883-3fc104faf878"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2760167b-8a24-453b-98e9-a4e109c79280"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/30042a72-b184-4252-b047-682fc70efe56"], "isController": false}, {"data": [0.3442622950819672, 500, 1500, "addBook"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d9114147-7c19-48ee-a3a7-c63161905195"], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9745762711864406, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=47b071d3-0cda-446d-ac53-39f60c5786f2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d676aa52-7e2d-4f08-9244-b2195cbecdb4"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=220a373e-201e-4cab-b4d3-8168f3210af8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/324fe44a-8477-4c34-9dab-eb9d8dfdc301"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1290, 7, 0.5426356589147286, 435.9263565891474, 136, 2756, 164.5, 1139.0, 1359.6000000000004, 1821.0699999999981, 5.076202056452089, 709.4407243966599, 3.7034570805148603], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/437a7872-6e83-4a3e-b9cd-84291c77a232", 3, 0, 0.0, 349.3333333333333, 249, 445, 354.0, 445.0, 445.0, 445.0, 0.02946665357037619, 0.024565136651605934, 0.018896258962773794], "isController": false}, {"data": ["see books", 55, 0, 0.0, 2160.5454545454545, 1677, 3295, 2180.0, 2540.4, 2738.3999999999987, 3295.0, 0.24619185955425843, 296.2526705172379, 1.210523450054386], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=735a4907-168d-4a58-b96f-88b4733e15b7", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 512.6666666666666, 153, 1235, 447.0, 1039.7000000000007, 1235.0, 1235.0, 0.07614744683956368, 0.014482143820317409, 0.05145281991446104], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 512.6666666666666, 153, 1235, 447.0, 1039.7000000000007, 1235.0, 1235.0, 0.07602828252109785, 0.014459480489241996, 0.05137230059998986], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f0ca123f-5cf5-4596-b5cf-50b145f4d10d", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 231.875, 136, 439, 146.0, 434.1, 439.0, 439.0, 0.11253578286220696, 0.061804014538216455, 0.06240845477819901], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 146.8125, 140, 153, 146.5, 152.3, 153.0, 153.0, 0.11253419984667215, 0.08363137312823975, 0.056486893282411604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 340.81249999999994, 138, 1029, 145.0, 1001.0, 1029.0, 1029.0, 0.11253499134887254, 6.228836498086905, 0.0644548558848767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 373.87500000000006, 141, 1263, 147.5, 1234.3, 1263.0, 1263.0, 0.11253340835560557, 19.01047390411802, 0.06434405331270221], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c05303e6-7ccf-48f6-a3e6-37a9a3ff09d9", 3, 0, 0.0, 317.6666666666667, 225, 479, 249.0, 479.0, 479.0, 479.0, 0.043322550831792976, 0.02785222587655961, 0.027781713912315154], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f523845d-2142-47ec-8cd6-d741c90320c6", 3, 0, 0.0, 365.6666666666667, 229, 531, 337.0, 531.0, 531.0, 531.0, 0.033473923813349404, 0.02790583297069916, 0.021466025362076275], "isController": false}, {"data": ["goToProfile", 12, 1, 8.333333333333334, 251.33333333333331, 155, 354, 234.5, 348.90000000000003, 354.0, 354.0, 0.07623839746888521, 0.1640974425988399, 0.04928072844200481], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/09834644-397b-48fa-b0ca-330822e9f637", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 1.3361336297071131, 2.496567730125523], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 196.94736842105263, 140, 480, 149.0, 449.0, 480.0, 480.0, 0.08737359569937965, 0.06493291633518351, 0.043857449403790175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 160.4736842105263, 136, 433, 147.0, 151.0, 433.0, 433.0, 0.08738605318591153, 0.023382596262636484, 0.04983735845759017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 985.0, 829, 1124, 1002.0, 1124.0, 1124.0, 1124.0, 0.09788566953797964, 28.781636954287393, 0.05582542090837901], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1161.3333333333333, 956, 1303, 1225.0, 1303.0, 1303.0, 1303.0, 0.0963948332369385, 86.73624039064006, 0.05488104275110854], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 142.33333333333334, 137, 147, 143.0, 147.0, 147.0, 147.0, 0.10011346192351331, 0.17715389941934193, 0.05543391885803911], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 192.27777777777774, 139, 439, 148.0, 414.70000000000005, 439.0, 439.0, 0.0877171608878926, 0.06518824163641236, 0.04402990302380546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 223.22222222222223, 137, 442, 147.0, 430.3, 442.0, 442.0, 0.08772442832914205, 0.023473138049008715, 0.05003033803146383], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 261.7222222222222, 137, 589, 145.5, 463.0000000000002, 589.0, 589.0, 0.08772100820678766, 0.023643552993235735, 0.05157035834031853], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 208.88888888888889, 137, 446, 147.5, 437.0, 446.0, 446.0, 0.087718870765737, 0.023642976886077555, 0.051654764718495526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 142.0, 139, 145, 142.0, 145.0, 145.0, 145.0, 0.1001401962747847, 0.07442059508311637, 0.0562310672441418], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/64cc9872-f3f0-490c-b2bc-4812318c801b", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 1.3884171195652173, 2.594259510869565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 214.89473684210523, 137, 598, 147.0, 447.0, 598.0, 598.0, 0.08738323989458821, 0.02355251387783823, 0.051371787516154406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 783.4705882352941, 136, 1432, 1006.0, 1354.3999999999999, 1432.0, 1432.0, 0.08538551560294731, 45.203615809756045, 0.045880980753100244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 234.84210526315792, 138, 439, 146.0, 436.0, 439.0, 439.0, 0.08738323989458821, 0.02355251387783823, 0.05145712271136396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 634.4705882352941, 138, 1064, 745.0, 1047.2, 1064.0, 1064.0, 0.08538808886388635, 14.778260945999568, 0.045965750272488455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70f77f99-5379-40a0-ac2c-53d9d344b350", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 1.33056640625, 2.4861653645833335], "isController": false}, {"data": ["deleteBooks", 11, 0, 0.0, 516.9090909090909, 410, 754, 458.0, 743.0, 754.0, 754.0, 0.08679665122738356, 0.015681035622134725, 0.059842222428254675], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2760167b-8a24-453b-98e9-a4e109c79280", 3, 0, 0.0, 435.6666666666667, 302, 600, 405.0, 600.0, 600.0, 600.0, 0.022254697595750834, 0.026304299143935967, 0.01427140438269178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 477.1666666666667, 281, 881, 304.5, 859.4000000000001, 881.0, 881.0, 0.08765266171916088, 0.13584450600420733, 0.19713289056565184], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d9114147-7c19-48ee-a3a7-c63161905195", 3, 0, 0.0, 360.0, 254, 523, 303.0, 523.0, 523.0, 523.0, 0.01818292017698042, 0.021491596081580702, 0.011660271077034972], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 532.904761904762, 168, 1412, 395.0, 1300.6000000000004, 1407.3, 1412.0, 0.09178040881616384, 0.05637683314977252, 0.041498368439339704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 145.9411764705882, 137, 157, 146.0, 155.4, 157.0, 157.0, 0.08538251366120218, 0.06345321571892076, 0.042858019552595626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 254.64705882352948, 137, 573, 145.0, 481.7999999999999, 573.0, 573.0, 0.08538594446899989, 0.09828604982018724, 0.044478386054968455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/68801efb-faec-414f-8593-9c81c9e6d859", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 1.2621973814229248, 2.3584177371541504], "isController": false}, {"data": ["login", 21, 0, 0.0, 2499.7142857142853, 1611, 4414, 2439.0, 3672.4000000000005, 4350.199999999999, 4414.0, 0.09079903147699757, 15.645795444104548, 0.1585056195412487], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 165.7894736842105, 143, 429, 151.0, 160.0, 429.0, 429.0, 0.08864627802272144, 0.07176539500081648, 0.03151098164088926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d676aa52-7e2d-4f08-9244-b2195cbecdb4", 1, 0, 0.0, 530.0, 530, 530, 530.0, 530.0, 530.0, 530.0, 1.8867924528301887, 0.3408755896226415, 1.3008549528301887], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f523845d-2142-47ec-8cd6-d741c90320c6", 1, 0, 0.0, 699.0, 699, 699, 699.0, 699.0, 699.0, 699.0, 1.4306151645207439, 0.2584607474964235, 0.9863420958512161], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 948.7647058823529, 283, 1581, 1154.0, 1509.0, 1581.0, 1581.0, 0.08532037801946309, 60.09729130541433, 0.17904634245341255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=324fe44a-8477-4c34-9dab-eb9d8dfdc301", 1, 0, 0.0, 601.0, 601, 601, 601.0, 601.0, 601.0, 601.0, 1.663893510815308, 0.3006057612312812, 1.1471765806988352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 593.4999999999999, 285, 1409, 569.0, 1378.9, 1409.0, 1409.0, 0.11241875988055507, 25.35879451738978, 0.2474392894783067], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 1, 25.0, 1027.5, 155, 1445, 1255.0, 1445.0, 1445.0, 1445.0, 0.1130678124204992, 101.45887290824547, 0.20946253922039743], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/220a373e-201e-4cab-b4d3-8168f3210af8", 3, 0, 0.0, 334.3333333333333, 235, 417, 351.0, 417.0, 417.0, 417.0, 0.030547720630912253, 0.030836094295722302, 0.019589521368130584], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb60b663-456d-4adb-ab90-482f560fcca8", 1, 0, 0.0, 327.0, 327, 327, 327.0, 327.0, 327.0, 327.0, 3.058103975535168, 0.9765625, 1.8247085244648318], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47b071d3-0cda-446d-ac53-39f60c5786f2", 3, 0, 0.0, 324.3333333333333, 221, 436, 316.0, 436.0, 436.0, 436.0, 0.0465614378171998, 0.029934518127919793, 0.029858734537722528], "isController": false}, {"data": ["register", 21, 3, 14.285714285714286, 1134.047619047619, 279, 1858, 1160.0, 1595.8000000000002, 1834.2999999999997, 1858.0, 0.09185347184253691, 0.029319300164024058, 0.04144170311645708], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 475.15789473684214, 282, 928, 304.0, 889.0, 928.0, 928.0, 0.08731577520323897, 0.135322397702676, 0.19637522489556575], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 150.17647058823525, 139, 166, 149.0, 161.2, 166.0, 166.0, 0.10113027959547888, 0.07851423074063058, 0.035948654074955386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c05303e6-7ccf-48f6-a3e6-37a9a3ff09d9", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0ca123f-5cf5-4596-b5cf-50b145f4d10d", 3, 0, 0.0, 317.6666666666667, 234, 466, 253.0, 466.0, 466.0, 466.0, 0.02583489777992112, 0.02591058595701073, 0.016567300985170768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 611.0000000000001, 292, 1485, 573.0, 1469.4, 1485.0, 1485.0, 0.09804177887003582, 15.770626509434885, 0.21715360409749274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 145.33333333333331, 138, 152, 145.5, 152.0, 152.0, 152.0, 0.03508484685464348, 0.026073797320687195, 0.017610948518834713], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 142.5, 136, 149, 142.5, 149.0, 149.0, 149.0, 0.03508505201358961, 0.009387992433323783, 0.020009443726500323], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 193.16666666666666, 144, 433, 145.0, 433.0, 433.0, 433.0, 0.035085872673368074, 0.009456739118993737, 0.020626655614616775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 141.83333333333331, 137, 147, 141.5, 147.0, 147.0, 147.0, 0.03508710373502219, 0.0094570709285802, 0.020661644093963264], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1366.8909090909092, 1099, 2352, 1171.0, 1911.2, 1985.5999999999995, 2352.0, 0.23904313207350358, 285.97869079879524, 0.4720168096217034], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=437a7872-6e83-4a3e-b9cd-84291c77a232", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 3, 14.285714285714286, 1134.047619047619, 279, 1858, 1160.0, 1595.8000000000002, 1834.2999999999997, 1858.0, 0.0909724959820481, 0.029038095815698387, 0.041044231585650605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 219.0, 137, 442, 148.5, 442.0, 442.0, 442.0, 0.04553837746761083, 0.012274015801816982, 0.026816056262665363], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 286.125, 136, 436, 281.0, 436.0, 436.0, 436.0, 0.04553682221286187, 0.012273596612060428, 0.026770670871233252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/735a4907-168d-4a58-b96f-88b4733e15b7", 3, 0, 0.0, 366.6666666666667, 234, 574, 292.0, 574.0, 574.0, 574.0, 0.04490211339280369, 0.028867732405855235, 0.02879464953900497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 389.7647058823529, 138, 1453, 146.0, 1360.1999999999998, 1453.0, 1453.0, 0.10105393307851891, 10.721504184078656, 0.0583869748910698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 295.11764705882354, 138, 1006, 145.0, 1001.2, 1006.0, 1006.0, 0.10088242450137377, 3.513731136470183, 0.05838639860129485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 251.12499999999997, 140, 440, 146.5, 440.0, 440.0, 440.0, 0.04553578543537903, 0.01218438008720103, 0.0259696276311146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 164.64705882352942, 139, 446, 147.0, 211.5999999999998, 446.0, 446.0, 0.10105153033626382, 0.07509786580653982, 0.050723131438319934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 252.62500000000003, 138, 442, 152.5, 442.0, 442.0, 442.0, 0.04546617032764059, 0.033788823847006336, 0.022821886277741465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 179.29411764705884, 136, 431, 148.0, 429.4, 431.0, 431.0, 0.10088481920846958, 0.044820955408909915, 0.056539079515040745], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 151.25, 147, 155, 151.5, 155.0, 155.0, 155.0, 0.04694973444056457, 0.03695457613192875, 0.016689163414419436], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 487.45454545454544, 417, 600, 471.0, 594.8000000000001, 600.0, 600.0, 0.0866919912362278, 0.01566212732295131, 0.05900812294106521], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1458.3333333333333, 1012, 2756, 1356.0, 1986.2, 2680.299999999999, 2756.0, 0.09260729216277716, 0.047931508638937394, 0.04259573692252738], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 580.8750000000001, 290, 882, 572.0, 882.0, 882.0, 882.0, 0.04542795977354162, 0.07040446500059624, 0.10216854624850229], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2768b2fb-1629-4b42-9883-3fc104faf878", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 1.4192708333333333, 2.6519097222222223], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2760167b-8a24-453b-98e9-a4e109c79280", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30042a72-b184-4252-b047-682fc70efe56", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 1.3531183792372883, 2.5283037605932206], "isController": false}, {"data": ["addBook", 61, 2, 3.278688524590164, 1343.9672131147543, 730, 2376, 1159.0, 2130.2000000000003, 2288.2999999999997, 2376.0, 0.2953508865368414, 99.58386561807015, 1.0736163597761144], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 257.8181818181818, 139, 847, 150.0, 590.6, 602.5999999999999, 847.0, 0.2405402095761244, 0.17876083934319403, 0.11627676146502108], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 853.2181818181817, 681, 1200, 734.0, 1137.8, 1174.6, 1200.0, 0.24040457905158208, 70.68692842445395, 0.12090659981598122], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 198.32727272727274, 136, 448, 148.0, 430.2, 435.99999999999994, 448.0, 0.2413243882426758, 0.4270310463825474, 0.11736283725083257], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d9114147-7c19-48ee-a3a7-c63161905195", 1, 0, 0.0, 754.0, 754, 754, 754.0, 754.0, 754.0, 754.0, 1.3262599469496021, 0.2396075099469496, 0.9143940649867374], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1100.2909090909088, 953, 1511, 1012.0, 1353.0, 1472.8, 1511.0, 0.2399609081865936, 215.91724699258083, 0.12044912774209873], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 153.39999999999998, 146, 170, 152.0, 165.2, 170.0, 170.0, 0.09971746717633372, 0.07449595936513212, 0.035446443410337376], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 2, 1.1299435028248588, 212.8983050847458, 138, 603, 155.0, 347.80000000000024, 438.2, 591.3, 0.7191409313078208, 1.4987855926513547, 0.348591790264782], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 152.83333333333334, 148, 166, 150.5, 166.0, 166.0, 166.0, 0.033638697958131035, 0.026050280742966708, 0.01195750591480439], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 188.6875, 140, 447, 153.0, 436.5, 447.0, 447.0, 0.10578232641781374, 0.08584483716133127, 0.03760231134383223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 340.8333333333333, 286, 572, 297.0, 572.0, 572.0, 572.0, 0.035054509762680965, 0.05432764354821747, 0.07883841404634206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 590.9411764705883, 284, 1900, 299.0, 1564.7999999999997, 1900.0, 1900.0, 0.10079150979752764, 14.323910608676965, 0.2236485322236386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 154.33333333333334, 144, 166, 153.5, 166.0, 166.0, 166.0, 0.09227598722490221, 0.07650616518939646, 0.032801229833851954], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=47b071d3-0cda-446d-ac53-39f60c5786f2", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 169.23529411764707, 146, 439, 152.0, 218.19999999999982, 439.0, 439.0, 0.08722018993479008, 0.06771489355288879, 0.031004051890882414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d676aa52-7e2d-4f08-9244-b2195cbecdb4", 3, 0, 0.0, 818.3333333333334, 222, 1762, 471.0, 1762.0, 1762.0, 1762.0, 0.015632734946978973, 0.021550987142075505, 0.010024898387222845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 170.13333333333333, 137, 503, 147.0, 299.0000000000001, 503.0, 503.0, 0.09813606893077483, 0.07293119966437465, 0.04925970647501783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 200.33333333333331, 137, 439, 146.0, 433.0, 439.0, 439.0, 0.09813542688910697, 0.04591153500163559, 0.054868948315341844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 356.46666666666664, 137, 1347, 146.0, 1327.8, 1347.0, 1347.0, 0.0981418476838524, 11.797352930352002, 0.056572130168803976], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=220a373e-201e-4cab-b4d3-8168f3210af8", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/324fe44a-8477-4c34-9dab-eb9d8dfdc301", 3, 0, 0.0, 409.0, 243, 564, 420.0, 564.0, 564.0, 564.0, 0.026144930062312083, 0.026221526537104013, 0.01676611726001133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 352.53333333333336, 138, 995, 149.0, 971.0, 995.0, 995.0, 0.09813671098084371, 3.8703176521773264, 0.0566650058391343], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 42.857142857142854, 0.23255813953488372], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 14.285714285714286, 0.07751937984496124], "isController": false}, {"data": ["401/Unauthorized", 3, 42.857142857142854, 0.23255813953488372], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1290, 7, "406/Not Acceptable", 3, "401/Unauthorized", 3, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
