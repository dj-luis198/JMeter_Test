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

    var data = {"OkPercent": 98.01678108314263, "KoPercent": 1.9832189168573608};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8102094240837696, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3425925925925926, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b43cce0f-6679-434a-bc49-2a7f2d468c36"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9b618dc2-0675-4a7e-9393-fc50634f322e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/45f8daae-cc2d-4737-b284-e4c565cb8343"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9f8b952e-92fb-44ee-953b-c26c9eeec81a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7f51c7f4-1410-4eae-aadf-3fa2f1ce695e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/78632484-0052-41b4-aa3f-0c458f796047"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/abb06744-d22c-48f1-8138-a4506361e97c"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e4f993ab-e6b9-4cbd-a749-56e1b76d860a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/496d1078-2a88-4e8f-bf84-cdcc20edd3a0"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7dfcf535-785a-4061-ba22-c8434a16b263"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7a28b98-af18-48cb-8562-6557c698c8eb"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1d48a77a-b9f6-4adf-88d0-690d30e80d3a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b43cce0f-6679-434a-bc49-2a7f2d468c36"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7f5530d7-b758-4b74-b9db-7ef449e37439"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5324a0ed-5d09-49a5-9cd0-45c52a1311c3"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=78632484-0052-41b4-aa3f-0c458f796047"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=abb06744-d22c-48f1-8138-a4506361e97c"], "isController": false}, {"data": [0.33064516129032256, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7f51c7f4-1410-4eae-aadf-3fa2f1ce695e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab2d3680-a67e-499f-9862-7c7fc0b96af1"], "isController": false}, {"data": [0.7592592592592593, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9f8b952e-92fb-44ee-953b-c26c9eeec81a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9157303370786517, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e4f993ab-e6b9-4cbd-a749-56e1b76d860a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ab2d3680-a67e-499f-9862-7c7fc0b96af1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a7a28b98-af18-48cb-8562-6557c698c8eb"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9b618dc2-0675-4a7e-9393-fc50634f322e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7f5530d7-b758-4b74-b9db-7ef449e37439"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7dfcf535-785a-4061-ba22-c8434a16b263"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5324a0ed-5d09-49a5-9cd0-45c52a1311c3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=496d1078-2a88-4e8f-bf84-cdcc20edd3a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1311, 26, 1.9832189168573608, 310.59496567505727, 81, 3589, 95.0, 888.1999999999987, 1028.0, 1660.9999999999793, 5.060720930771191, 686.7565158651769, 3.701591596250203], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1423.0370370370376, 997, 1839, 1410.0, 1732.0, 1814.5, 1839.0, 0.24540657962307363, 295.30780809035053, 1.2066622347677498], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b43cce0f-6679-434a-bc49-2a7f2d468c36", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 662.5000000000001, 92, 2441, 463.0, 1719.0, 2441.0, 2441.0, 0.07175292393165021, 0.013548769885810346, 0.048524316233073995], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 662.5000000000001, 92, 2441, 463.0, 1719.0, 2441.0, 2441.0, 0.07011077502453877, 0.013238690568598386, 0.047413780961419044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 126.30000000000001, 83, 257, 85.0, 254.70000000000002, 256.9, 257.0, 0.11023170704821536, 0.029495593487510748, 0.06286652042593531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 85.70000000000002, 83, 92, 85.5, 89.80000000000001, 91.9, 92.0, 0.11022927689594356, 0.08191843722442681, 0.055329930004409174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 109.89999999999999, 83, 253, 85.5, 250.4, 252.9, 253.0, 0.11023170704821536, 0.02971088979033929, 0.0649118353028065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 117.7, 82, 255, 85.0, 248.0, 254.65, 255.0, 0.11023109950010196, 0.029710726037136856, 0.06480382997955213], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b618dc2-0675-4a7e-9393-fc50634f322e", 3, 0, 0.0, 381.0, 182, 567, 394.0, 567.0, 567.0, 567.0, 0.022764351026292824, 0.02690669224494442, 0.014598232917251585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45f8daae-cc2d-4737-b284-e4c565cb8343", 1, 0, 0.0, 276.0, 276, 276, 276.0, 276.0, 276.0, 276.0, 3.6231884057971016, 1.1570142663043477, 2.1618829257246377], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 262.42857142857144, 86, 433, 218.5, 431.5, 433.0, 433.0, 0.0716911952970576, 0.15777963886840568, 0.04634223680369926], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9f8b952e-92fb-44ee-953b-c26c9eeec81a", 1, 0, 0.0, 529.0, 529, 529, 529.0, 529.0, 529.0, 529.0, 1.890359168241966, 0.34151996691871456, 1.303314035916824], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f51c7f4-1410-4eae-aadf-3fa2f1ce695e", 3, 0, 0.0, 339.3333333333333, 175, 431, 412.0, 431.0, 431.0, 431.0, 0.089227291654274, 0.040373025846172146, 0.057219324400690025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 85.47058823529412, 83, 89, 85.0, 88.2, 89.0, 89.0, 0.10118806695078689, 0.07519933491166877, 0.0507916664186567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/78632484-0052-41b4-aa3f-0c458f796047", 3, 0, 0.0, 446.66666666666663, 174, 733, 433.0, 733.0, 733.0, 733.0, 0.025799127989473956, 0.025874711372255617, 0.016544362675541567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 115.4705882352941, 82, 263, 86.0, 255.0, 263.0, 263.0, 0.10118746465878992, 0.044955414273384724, 0.056708691705604004], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 645.3333333333333, 488, 728, 663.5, 728.0, 728.0, 728.0, 0.04151387255241126, 12.206456920708503, 0.023675880440047047], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 814.1666666666667, 731, 991, 754.0, 991.0, 991.0, 991.0, 0.04148430856028707, 37.32765376418244, 0.023618507705710313], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 194.66666666666666, 84, 252, 245.5, 252.0, 252.0, 252.0, 0.0416311067629733, 0.07366754438916759, 0.023051599154888535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 95.3125, 82, 247, 85.5, 135.7000000000001, 247.0, 247.0, 0.07909867064796643, 0.05878328941709224, 0.03970382491509252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 109.125, 82, 310, 85.0, 267.30000000000007, 310.0, 310.0, 0.0791006258837023, 0.02116559716028753, 0.04511207569929897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 108.6875, 81, 317, 84.0, 268.00000000000006, 317.0, 317.0, 0.07909945273066142, 0.021319774368811086, 0.0465018267029865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 139.125, 83, 363, 85.0, 348.3, 363.0, 363.0, 0.07909984377780854, 0.021319879768237456, 0.046579302537127484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 141.5, 84, 255, 88.0, 255.0, 255.0, 255.0, 0.041628796025837606, 0.03093702517154533, 0.02337554464341467], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/abb06744-d22c-48f1-8138-a4506361e97c", 3, 0, 0.0, 261.3333333333333, 164, 425, 195.0, 425.0, 425.0, 425.0, 0.018412815319462348, 0.02538355236911557, 0.011807697324004173], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 656.7499999999998, 83, 1137, 911.0, 1098.5, 1137.0, 1137.0, 0.07758779543977733, 43.6413638267513, 0.041445824321834177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 189.88235294117644, 81, 991, 85.0, 975.0, 991.0, 991.0, 0.10118866924995387, 10.735799267721411, 0.05846482280078332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 455.5, 85, 763, 578.5, 703.5000000000001, 763.0, 763.0, 0.07758666673132222, 14.266002098476877, 0.041520989617934156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 141.82352941176472, 82, 495, 85.0, 487.8, 495.0, 495.0, 0.101189271556291, 3.524418608111808, 0.05856398844954226], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 379.7857142857143, 91, 750, 407.0, 642.5, 750.0, 750.0, 0.07094606578727329, 0.013396414626544978, 0.04855272401220272], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e4f993ab-e6b9-4cbd-a749-56e1b76d860a", 3, 0, 0.0, 448.66666666666663, 257, 802, 287.0, 802.0, 802.0, 802.0, 0.016981676770764342, 0.023410612345112956, 0.010889942460418542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 260.74999999999994, 169, 495, 174.0, 462.8, 495.0, 495.0, 0.07906505571615645, 0.12253539396634792, 0.1778191633928792], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/496d1078-2a88-4e8f-bf84-cdcc20edd3a0", 3, 0, 0.0, 327.6666666666667, 177, 435, 371.0, 435.0, 435.0, 435.0, 0.022905134567665585, 0.027475722943309792, 0.014688514029394924], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 564.3809523809523, 180, 1384, 517.0, 1094.4, 1356.9999999999995, 1384.0, 0.08908421427723008, 0.05472067459021261, 0.04027928829136477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 106.24999999999999, 82, 250, 86.0, 247.9, 250.0, 250.0, 0.07764691038090663, 0.057704393359247985, 0.03897510931229102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 147.5, 82, 260, 86.5, 259.3, 260.0, 260.0, 0.07764841767083866, 0.09366719524209322, 0.04020807956050996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7dfcf535-785a-4061-ba22-c8434a16b263", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7a28b98-af18-48cb-8562-6557c698c8eb", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 0.8287342316513762, 3.162629013761468], "isController": false}, {"data": ["login", 21, 0, 0.0, 2590.095238095238, 1576, 4500, 2287.0, 4395.400000000001, 4492.8, 4500.0, 0.08645212816322162, 29.668083649638344, 0.17139665085484687], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 111.82352941176472, 85, 262, 90.0, 255.6, 262.0, 262.0, 0.10613259082140382, 0.08592179471771853, 0.03772681939354589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1d48a77a-b9f6-4adf-88d0-690d30e80d3a", 1, 0, 0.0, 300.0, 300, 300, 300.0, 300.0, 300.0, 300.0, 3.3333333333333335, 1.064453125, 1.9889322916666667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b43cce0f-6679-434a-bc49-2a7f2d468c36", 3, 0, 0.0, 506.0, 314, 774, 430.0, 774.0, 774.0, 774.0, 0.0765091428425697, 0.034618394710667924, 0.04906348027339267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 774.625, 170, 1227, 998.0, 1187.1000000000001, 1227.0, 1227.0, 0.07755357255379067, 58.03321905794221, 0.16201804695868818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 238.45000000000002, 170, 348, 174.5, 342.7, 347.75, 348.0, 0.1101770545266243, 0.1707529155603054, 0.24779077790509346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 738.5, 86, 1246, 842.0, 1246.0, 1246.0, 1246.0, 0.05521506266909613, 49.54600169613771, 0.10252396463130141], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f5530d7-b758-4b74-b9db-7ef449e37439", 3, 0, 0.0, 419.6666666666667, 359, 537, 363.0, 537.0, 537.0, 537.0, 0.0785648814979704, 0.03554856291737593, 0.0503817762210292], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5324a0ed-5d09-49a5-9cd0-45c52a1311c3", 1, 0, 0.0, 750.0, 750, 750, 750.0, 750.0, 750.0, 750.0, 1.3333333333333333, 0.24088541666666666, 0.9192708333333334], "isController": false}, {"data": ["register", 24, 9, 37.5, 989.5833333333338, 169, 2317, 930.0, 1936.0, 2227.75, 2317.0, 0.09572775027820878, 0.029774695765243647, 0.04318966858255122], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 307.05882352941177, 170, 1076, 173.0, 1061.6, 1076.0, 1076.0, 0.10113569435603334, 14.372824141759523, 0.2244122510277171], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 91.66666666666666, 85, 123, 89.0, 105.60000000000001, 123.0, 123.0, 0.1046382655161108, 0.08123771590362118, 0.03719563344518001], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 249.75000000000003, 167, 434, 174.0, 368.20000000000005, 434.0, 434.0, 0.07807277358407705, 0.12099755046672879, 0.17558749762122017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 132.0, 84, 249, 86.0, 249.0, 249.0, 249.0, 0.04901686180045936, 0.03642757014663044, 0.024604166958433704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 131.14285714285714, 83, 249, 85.0, 249.0, 249.0, 249.0, 0.049016518566757, 0.023632964308972125, 0.027366644434174317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 236.0, 83, 811, 86.0, 811.0, 811.0, 811.0, 0.04901617533786149, 6.312015582329669, 0.028214388873328198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 189.57142857142858, 82, 660, 86.0, 660.0, 660.0, 660.0, 0.049016518566757, 2.070250408762753, 0.02826245413454334], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 3.2408997252747254, 6.793011675824176], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 979.0370370370368, 655, 1474, 966.0, 1334.5, 1453.25, 1474.0, 0.25420976071329376, 304.1232514252223, 0.5019649767209765], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, 37.5, 989.5833333333338, 169, 2317, 930.0, 1936.0, 2227.75, 2317.0, 0.09286128845037725, 0.02888312536273941, 0.04189640162507255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 166.66666666666666, 82, 492, 86.0, 492.0, 492.0, 492.0, 0.05243074772071888, 1.7254927215927296, 0.030374106128571846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 194.88888888888889, 83, 914, 85.0, 914.0, 914.0, 914.0, 0.05242983140896434, 5.254389587508302, 0.030322374284915358], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 107.73333333333332, 83, 255, 86.0, 253.8, 255.0, 255.0, 0.10771064612026253, 0.02903138508710201, 0.06332207906679496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 157.4, 82, 340, 87.0, 289.6, 340.0, 340.0, 0.10764339894796518, 0.029013259872693743, 0.06338766559142872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 139.44444444444446, 84, 253, 85.0, 253.0, 253.0, 253.0, 0.052430136842657155, 0.022778891918185683, 0.029412305498756237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 96.93333333333332, 83, 248, 86.0, 152.60000000000005, 248.0, 248.0, 0.10783919019957439, 0.08014221068542589, 0.05413021851814574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 117.0, 84, 250, 86.0, 250.0, 250.0, 250.0, 0.05242983140896434, 0.03896396650607604, 0.026317317718952803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 129.53333333333336, 82, 259, 85.0, 259.0, 259.0, 259.0, 0.1078430667692374, 0.02885644560036235, 0.06150424901683071], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 506.2142857142857, 86, 898, 429.0, 850.0, 898.0, 898.0, 0.07148437300545835, 0.013358442751229275, 0.048651857381016815], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 107.55555555555556, 85, 255, 90.0, 255.0, 255.0, 255.0, 0.05243746831902956, 0.04127402291517365, 0.018639881316530035], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=78632484-0052-41b4-aa3f-0c458f796047", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1518.857142857143, 816, 3589, 1114.0, 2968.2000000000003, 3535.7999999999993, 3589.0, 0.08889829611599111, 0.046011813419409464, 0.040889743623663884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 350.3333333333333, 170, 1000, 270.0, 1000.0, 1000.0, 1000.0, 0.052403882545431255, 7.038109813791538, 0.11636777954560011], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=abb06744-d22c-48f1-8138-a4506361e97c", 1, 0, 0.0, 535.0, 535, 535, 535.0, 535.0, 535.0, 535.0, 1.8691588785046729, 0.3376898364485981, 1.288697429906542], "isController": false}, {"data": ["addBook", 62, 13, 20.967741935483872, 892.1290322580649, 428, 2855, 713.0, 1593.2, 1678.1499999999999, 2855.0, 0.28534347069706645, 78.17479398172651, 1.0393993678146372], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7f51c7f4-1410-4eae-aadf-3fa2f1ce695e", 1, 0, 0.0, 164.0, 164, 164, 164.0, 164.0, 164.0, 164.0, 6.097560975609756, 1.101610137195122, 4.203982469512195], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 146.40740740740742, 83, 364, 86.0, 341.5, 347.5, 364.0, 0.25547617921180865, 0.1898607152150258, 0.1234967858494583], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab2d3680-a67e-499f-9862-7c7fc0b96af1", 1, 0, 0.0, 353.0, 353, 353, 353.0, 353.0, 353.0, 353.0, 2.8328611898017, 0.5117962110481586, 1.953125], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 547.2407407407408, 410, 765, 500.0, 745.0, 754.5, 765.0, 0.25512252968161653, 75.0144945916386, 0.12830869412698487], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f8b952e-92fb-44ee-953b-c26c9eeec81a", 3, 0, 0.0, 485.0, 198, 898, 359.0, 898.0, 898.0, 898.0, 0.03620127911186195, 0.030179516863762516, 0.023215012972125013], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 112.98148148148147, 82, 294, 86.5, 254.0, 261.0, 294.0, 0.25582838652826667, 0.45269632459884684, 0.12441653954206719], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 830.7777777777782, 570, 1143, 843.5, 1060.5, 1097.25, 1143.0, 0.25466172434283124, 229.14506721124192, 0.12782824835177273], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 111.125, 85, 257, 89.5, 252.1, 257.0, 257.0, 0.08140587953964976, 0.0608159158670235, 0.028937246242609873], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 13, 7.303370786516854, 151.91011235955048, 83, 1507, 90.0, 340.69999999999993, 362.15, 761.2400000000075, 0.7524295442728698, 1.5424244241589062, 0.36434660291798937], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 114.71428571428571, 85, 259, 91.0, 259.0, 259.0, 259.0, 0.05291525244355076, 0.040978315613023196, 0.018809718642043435], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e4f993ab-e6b9-4cbd-a749-56e1b76d860a", 1, 0, 0.0, 360.0, 360, 360, 360.0, 360.0, 360.0, 360.0, 2.7777777777777777, 0.5018446180555556, 1.9151475694444444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab2d3680-a67e-499f-9862-7c7fc0b96af1", 3, 0, 0.0, 365.0, 228, 434, 433.0, 434.0, 434.0, 434.0, 0.0222197533607377, 0.03063172378994927, 0.014248995481983485], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 88.29999999999998, 85, 92, 88.0, 91.80000000000001, 92.0, 92.0, 0.10725298297358896, 0.08703830942485588, 0.03812508379139295], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7a28b98-af18-48cb-8562-6557c698c8eb", 3, 0, 0.0, 248.33333333333334, 166, 370, 209.0, 370.0, 370.0, 370.0, 0.09684604706717888, 0.04375726345353004, 0.06210504971430416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 369.0, 168, 895, 174.0, 895.0, 895.0, 895.0, 0.04898736126079471, 8.437348554697888, 0.10838316995465169], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 278.53333333333336, 171, 502, 332.0, 455.20000000000005, 502.0, 502.0, 0.10757546418812797, 0.16672095865874909, 0.2419397402590417], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9b618dc2-0675-4a7e-9393-fc50634f322e", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.45853822969543145, 1.7498810279187818], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 100.3125, 86, 255, 89.0, 146.5000000000001, 255.0, 255.0, 0.07414444264232257, 0.06147327324544128, 0.026356032345513106], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7f5530d7-b758-4b74-b9db-7ef449e37439", 1, 0, 0.0, 170.0, 170, 170, 170.0, 170.0, 170.0, 170.0, 5.88235294117647, 1.0627297794117647, 4.055606617647059], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7dfcf535-785a-4061-ba22-c8434a16b263", 3, 0, 0.0, 417.0, 403, 441, 407.0, 441.0, 441.0, 441.0, 0.019606817944159784, 0.023174595037514376, 0.012573382600909755], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5324a0ed-5d09-49a5-9cd0-45c52a1311c3", 3, 0, 0.0, 328.0, 290, 382, 312.0, 382.0, 382.0, 382.0, 0.02538264334847831, 0.025457006561413306, 0.016277281053548916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 99.1875, 84, 204, 90.5, 139.60000000000008, 204.0, 204.0, 0.07741773156369301, 0.06010458651673433, 0.027519584266781503], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=496d1078-2a88-4e8f-bf84-cdcc20edd3a0", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 84.6875, 82, 87, 84.5, 87.0, 87.0, 87.0, 0.07810516860953273, 0.058044954406107824, 0.03920513346220686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 125.12499999999999, 81, 253, 85.0, 250.9, 253.0, 253.0, 0.0781055498874792, 0.020899336590985643, 0.044544571420202975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 142.375, 83, 350, 85.0, 282.1000000000001, 350.0, 350.0, 0.07810593116914816, 0.021051989260434466, 0.045917744691237494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 125.87500000000001, 82, 255, 85.0, 252.9, 255.0, 255.0, 0.07810669374365384, 0.021052194798094195, 0.04599446906974927], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 34.61538461538461, 0.6864988558352403], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 3.8461538461538463, 0.07627765064836003], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 3.8461538461538463, 0.07627765064836003], "isController": false}, {"data": ["401/Unauthorized", 15, 57.69230769230769, 1.1441647597254005], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1311, 26, "401/Unauthorized", 15, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
